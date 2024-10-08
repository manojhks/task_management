import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const NewTask = ({ handleTaskAdded, toggleAddTask }) => {
    const [task, setTask] = useState({
        title: '',
        status: 'Todo',
        subtasks: [],
    });
    const nav = useNavigate();

    const addTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/tasks', task);
            if (handleTaskAdded) {
                handleTaskAdded();
            }

            setTask({
                title: '',
                status: '',
                subtasks: [],
            });

            toggleAddTask();
            nav('/');
        } catch (error) {
            console.error('Error adding task:', error);
            alert('There was an error adding the task. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    return (
        <div>
            <form onSubmit={addTask}>
                <div className='row mb-4'>
                    <label className='col-3'>Task Title</label>
                    <input
                        className='col-7'
                        type='text'
                        name='title'
                        placeholder='Enter task title'
                        value={task.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='row mb-4'>
                    <label className='col-3'>Status</label>
                    <select
                        className='col-7'
                        type='text'
                        name='status'
                        placeholder='Enter status'
                        value={task.status}
                        onChange={handleInputChange}
                        required
                    >
                        <option>Todo</option>
                        <option disabled>In progress</option>
                        <option disabled>Completed</option>
                    </select>
                </div>
                <button className='btn btn-info' type='submit'>
                    Add Task
                </button>
            </form>
        </div>
    );
};
