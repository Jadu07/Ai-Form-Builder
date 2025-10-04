const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Save a form response (public endpoint)
router.post('/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Response data is required' });
    }

    // Check if form exists
    const form = await prisma.form.findUnique({
      where: { id: formId }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Save the response
    const response = await prisma.response.create({
      data: {
        formId,
        data
      }
    });

    res.json({ 
      message: 'Response saved successfully',
      responseId: response.id
    });
  } catch (error) {
    console.error('Save response error:', error);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// Get all responses for a form (authenticated users only)
router.get('/:formId', authenticateUser, async (req, res) => {
  try {
    const { formId } = req.params;
    
    // Check if user owns the form
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        ownerId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found or access denied' });
    }

    // Get all responses for this form
    const responses = await prisma.response.findMany({
      where: { formId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(responses);
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get response statistics for a form
router.get('/:formId/stats', authenticateUser, async (req, res) => {
  try {
    const { formId } = req.params;
    
    // Check if user owns the form
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        ownerId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found or access denied' });
    }

    // Get response count
    const responseCount = await prisma.response.count({
      where: { formId }
    });

    // Get responses for field analysis
    const responses = await prisma.response.findMany({
      where: { formId },
      select: { data: true }
    });

    // Calculate field completion rates
    const fieldStats = {};
    const schema = form.schema;
    
    if (schema && schema.schema && schema.schema.properties) {
      const fields = Object.keys(schema.schema.properties);
      
      fields.forEach(field => {
        const completed = responses.filter(response => 
          response.data && response.data[field] && response.data[field] !== ''
        ).length;
        
        fieldStats[field] = {
          total: responseCount,
          completed,
          completionRate: responseCount > 0 ? (completed / responseCount) * 100 : 0
        };
      });
    }

    res.json({
      totalResponses: responseCount,
      fieldStats,
      formSchema: schema
    });
  } catch (error) {
    console.error('Get response stats error:', error);
    res.status(500).json({ error: 'Failed to fetch response statistics' });
  }
});

module.exports = router;



