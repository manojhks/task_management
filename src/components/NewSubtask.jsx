import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const NewSubtask = ({ handleAddsubTask, currentTaskId }) => {
    const nav = useNavigate()
    const [subtask, setSubtask] = useState({
        subtask_id: "",
        subtask_title: "",
        subtask_status: "Todo"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const responseGet = await axios.get(`http://localhost:3001/tasks`);
            const task = responseGet.data.find(item => item.id === currentTaskId);

            if (task) {
                const newSubtaskId = task.subtasks.length + 1;
                const newSubtask = {
                    ...subtask, subtask_id: newSubtaskId
                }
                const updatedTask = {
                    ...task,
                    subtasks: [...task.subtasks, newSubtask]
                };

                await axios.put(`http://localhost:3001/tasks/${currentTaskId}`, updatedTask);
            }

            handleAddsubTask()
            nav('/')
            setSubtask({
                subtask_id: "",
                subtask_title: "",
                subtask_status: ""
            })
        } catch (error) {
            console.error("Error adding subtask:", error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubtask((prevSubtask) => ({
            ...prevSubtask,
            [name]: value
        }));
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <div className='row mb-4'>
                <label className='col-3'>Subtask Title</label>
                <input
                    className='col-7'
                    type="text"
                    name='subtask_title'
                    placeholder='Enter Subtask'
                    value={subtask.subtask_title}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className='row mb-4'>
                    <label className='col-3'>Status</label>
                    <select
                    className='col-7'
                    name='subtask_status'
                    value={subtask.subtask_status}
                    onChange={(e) => handleInputChange(subtask.subtask_id, e.target.name, e.target.value)}
                    required
                >
                    <option value="Todo">Todo</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                </select>

                </div>
            <button className='btn btn-info' type="submit">Add Subtask</button>
        </form>
    );
};
