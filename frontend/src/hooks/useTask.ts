import { useState } from 'react';
import { Task } from '../types/Task';
import { createTask, updateTask } from '../services/taskService';

interface TaskErrors {
    description?: string;
    cost?: string;
    general?: string;
}

export const useTask = (initialTask: Task = { description: '', cost: 0 }) => {
    const [task, setTask] = useState<Task>(initialTask);
    const [errors, setErrors] = useState<TaskErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Clear the error for this field when the user starts typing
        if (errors[name as keyof TaskErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        
        if (name === 'cost') {
            // Convert to number for cost field
            setTask(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setTask(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: TaskErrors = {};
        
        // Validate description
        if (!task.description) {
            newErrors.description = 'Task description is required';
        } else if (task.description.length < 3) {
            newErrors.description = 'Description must be at least 3 characters';
        } else if (task.description.length > 255) {
            newErrors.description = 'Description must be less than 255 characters';
        }
        
        // Validate cost
        if (task.cost < 0) {
            newErrors.cost = 'Cost must be a positive number';
        }
        
        // Update errors
        setErrors(newErrors);
        
        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return false;

        try {
            if (task.id) {
                // Update existing task
                await updateTask(task.id, task);
            } else {
                // Create new task
                await createTask(task);
            }
            
            // Reset form on success
            setTask({ description: '', cost: 0 });
            setErrors({});
            return true;
        } catch (error) {
            console.error('Error while saving task', error);
            
            // Handle validation errors from the backend
            if (error && typeof error === 'object' && !Array.isArray(error)) {
                // If the error is an object of validation errors from the backend
                setErrors(error as TaskErrors);
            } else {
                // Set a generic error message
                setErrors({ general: 'Failed to save task. Please try again.' });
            }
            
            return false;
        }
    };

    return {
        task,
        setTask,
        errors,
        handleChange,
        handleSubmit,
        validateForm
    };
};
