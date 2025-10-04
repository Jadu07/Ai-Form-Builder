const express = require('express');
const prisma = require('../lib/prisma');
const openRouterService = require('../lib/openrouter');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get all forms for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const forms = await prisma.form.findMany({
      where: {
        ownerId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        responses: {
          select: {
            id: true
          }
        }
      }
    });

    const formsWithResponseCount = forms.map(form => ({
      ...form,
      responseCount: form.responses.length
    }));

    res.json(formsWithResponseCount);
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Get a specific form by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Generate a new form from natural language
router.post('/generate', authenticateUser, async (req, res) => {
  try {
    const { prompt, title } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate schema using OpenRouter
    const generatedSchema = await openRouterService.generateFormSchema(prompt);
    
    // Create the form in database
    const form = await prisma.form.create({
      data: {
        ownerId: req.user.id,
        title: title || 'Untitled Form',
        schema: generatedSchema,
        version: 1
      }
    });

    // Create initial version record
    await prisma.formVersion.create({
      data: {
        formId: form.id,
        schema: generatedSchema,
        changePrompt: prompt
      }
    });

    res.json({
      form,
      followups: generatedSchema.followups || []
    });
  } catch (error) {
    console.error('Generate form error:', error);
    
    // Provide more specific error messages
    if (error.message.includes('Failed to generate form schema')) {
      res.status(500).json({ error: 'AI service is currently unavailable. Please try again later.' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'A form with this title already exists' });
    } else if (error.code === 'P1001') {
      res.status(500).json({ error: 'Database connection failed. Please check your connection.' });
    } else {
      res.status(500).json({ 
        error: 'Failed to generate form',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Update/refine an existing form
router.put('/:id/refine', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { instruction } = req.body;
    
    if (!instruction) {
      return res.status(400).json({ error: 'Instruction is required' });
    }

    // Get the current form
    const currentForm = await prisma.form.findFirst({
      where: {
        id,
        ownerId: req.user.id
      }
    });

    if (!currentForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Refine the schema using OpenRouter
    const refinedSchema = await openRouterService.refineFormSchema(
      currentForm.schema,
      instruction
    );

    // Update the form with new schema and increment version
    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        schema: refinedSchema,
        version: currentForm.version + 1
      }
    });

    // Create new version record
    await prisma.formVersion.create({
      data: {
        formId: id,
        schema: refinedSchema,
        changePrompt: instruction
      }
    });

    res.json({
      form: updatedForm,
      followups: refinedSchema.followups || []
    });
  } catch (error) {
    console.error('Refine form error:', error);
    res.status(500).json({ error: 'Failed to refine form' });
  }
});

// Update form title
router.put('/:id/title', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const form = await prisma.form.findFirst({
      where: {
        id,
        ownerId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: { title }
    });

    res.json(updatedForm);
  } catch (error) {
    console.error('Update form title error:', error);
    res.status(500).json({ error: 'Failed to update form title' });
  }
});

// Delete a form
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await prisma.form.findFirst({
      where: {
        id,
        ownerId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    await prisma.form.delete({
      where: { id }
    });

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

module.exports = router;


