import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from 'reactstrap';
import { NewSubtask } from './NewSubtask';
import { Pagination } from './Pagination';

export const TaskTable = ({ search, refresh, sort }) => {
    const [task, setTask] = useState([])
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
    const [addSubTask, setAddsubTask] = useState(false)
    const [currentTaskId, setCurrentTaskId] = useState(null)
    const [currentTaskTitle, setCurrentTaskTitle] = useState(null)
    const [editModal, setEditModal] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 3;
    const startIndex = (currentPage - 1) * itemsPerPage;

    const handleAddsubTask = (taskId, title) => {
        setCurrentTaskId(taskId);
        setCurrentTaskTitle(title);
        setAddsubTask(prevState => !prevState);
        fetchdata();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index)
    }

    const fetchdata = async () => {
        try {
            const response = await axios.get('http://localhost:3001/tasks')
            setTask(response.data)
            console.log(task)
            if (task.length < itemsPerPage) {
                setTotalItems(false)
            }
            else {
                setTotalItems(true)
            }
            console.log(totalItems)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteTask = async (taskId) => {
        const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;
        try {
            const response = await axios.delete(`http://localhost:3001/tasks/${taskId}`)

            console.log('Task deleted:', response)
            fetchdata()
        } catch (error) {
            console.error(error)

        }
    }

    const handleEditTask = (task) => {

        setTaskToEdit({
            id: task.id,
            title: task.title,
            status: task.status,
            subtasks: [...task.subtasks]
        })
        setEditModal(true)
    }

    const handleTaskChange = (field, value) => {
        if (field === 'status' && value === 'Completed') {
            const allSubtasksCompleted = taskToEdit.subtasks.every(
                (subtask) => subtask.subtask_status === 'Completed'
            )
            if (!allSubtasksCompleted) {
                alert("Cannot mark the task as 'Completed' until all subtasks are completed.");
                return;
            }
        }
        setTaskToEdit((prevTask) => ({
            ...prevTask,
            [field]: value,
        }))
    }

    const handleSubtaskChange = (subtaskId, field, value) => {
        setTaskToEdit(prevTask => {
            const updatedSubtasks = prevTask.subtasks.map(subtask =>
                subtask.subtask_id === subtaskId ? { ...subtask, [field]: value } : subtask
            );
            const isAnySubtaskInProgress = updatedSubtasks.some(subtask => subtask.subtask_status === 'In progress');

            const areAllSubtasksCompleted = updatedSubtasks.every(subtask => subtask.subtask_status === 'Completed');
    
            let newTaskStatus = prevTask.status;
    
            if (areAllSubtasksCompleted) {
                newTaskStatus = 'Completed';
            } else if (isAnySubtaskInProgress) {
                newTaskStatus = 'In progress';
            } else {
                newTaskStatus = 'Todo';
            }
    
            return {
                ...prevTask,
                subtasks: updatedSubtasks,
                status: newTaskStatus
            };
        });
    };

    const saveTaskEdit = async () => {
        const confirmed = window.confirm("Are you sure you want to edit this task?");
    if (!confirmed) return;
        try {
            await axios.put(`http://localhost:3001/tasks/${taskToEdit.id}`, taskToEdit)
            setEditModal(false)
            fetchdata()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchdata()
    }, [refresh, currentPage])

    const sortedData = [...task].sort((a, b) => {
        if (sort === 'title') {
            return a.title.localeCompare(b.title)
        } else if (sort === 'subtask_title') {
            const aSubtaskTitle = a.subtasks[0]?.subtask_title || ''
            const bSubtaskTitle = b.subtasks[0]?.subtask_title || ''
            return aSubtaskTitle.localeCompare(bSubtaskTitle)
        } else if (sort === 'status') {
            return a.status.localeCompare(b.status)
        }
        return 0
    })
    const filteredData = sortedData.filter(
        (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.subtasks.filter((subtask) =>
                subtask.subtask_title.toLowerCase().includes(search.toLowerCase())
            ).length>0
    )
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className='py-3'>
            <Table>
                <thead>
                    <tr>
                        <th className="table-head w-25">Title</th>
                        <th className="table-head w-25">Status</th>
                        <th className="table-head" style={{width:"30%"}}>Subtasks</th>
                        <th className="table-head" style={{width:"20%"}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                            <tr key={index} className="align-middle">
                                <td>{item.title}</td>
                                <td>{item.status}</td>
                                <td>
                                    {item.subtasks.length > 0 ? (
                                        <ul>
                                            {item.subtasks.map((subtask) => (
                                                <li style={{ listStyleType: 'circle' }} key={subtask.subtask_id}>
                                                    Subtask : {subtask.subtask_title} <br /> Status :{' '}
                                                    {subtask.subtask_status}
                                                </li>
                                            ))}
                                            <button onClick={() => handleAddsubTask(item.id,item.title)} className="add-subtask-button">
                                                + Add Subtask
                                            </button>
                                        </ul>
                                    ) : (
                                        <button onClick={() => handleAddsubTask(item.id,item.title)} className="add-subtask-button">
                                            + Add Subtask
                                        </button>
                                    )}
                                </td>
                                <td className="action-button">
                                    <Dropdown
                                        className="action-dropdown"
                                        isOpen={openDropdownIndex === index}
                                        toggle={() => toggleDropdown(index)}
                                    >
                                        <DropdownToggle key={index} className="dropdown" caret>
                                            Actions&nbsp;
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => handleEditTask(item)}>
                                                <i className="bi bi-pencil-square"></i> Edit
                                            </DropdownItem>
                                            <DropdownItem onClick={() => handleDeleteTask(item.id)}>
                                                <i className="bi bi-trash"></i> Delete
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal isOpen={addSubTask} toggle={() => handleAddsubTask(currentTaskId)}>
                <ModalHeader toggle={() => handleAddsubTask(currentTaskId)}><span className='fw-normal'>Add Subtask to</span> <span className='fw-bolder'>{currentTaskTitle}</span></ModalHeader>
                <ModalBody>
                    <NewSubtask handleAddsubTask={handleAddsubTask} currentTaskId={currentTaskId} />
                </ModalBody>
            </Modal>

            {taskToEdit && (
                <Modal isOpen={editModal} toggle={() => setEditModal(false)}>
                    <ModalHeader toggle={() => setEditModal(false)}>Edit Task</ModalHeader>
                    <ModalBody>
                        <ModalBody>
                            <Label className='fs-5 fw-medium'>Task</Label>
                            <Input
                                type="text"
                                value={taskToEdit.title}
                                onChange={(e) => handleTaskChange('title', e.target.value)}
                                placeholder="Task Title"
                            /></ModalBody>
                        <ModalBody>
                            <Label className='fs-5 fw-medium'>Status</Label>
                            <Input
                                type="select"
                                value={taskToEdit.status}
                                onChange={(e) => handleTaskChange('status', e.target.value)}
                                className="form-select"
                            >
                                <option value="Todo">Todo</option>
                                <option value="In progress">In progress</option>
                                <option value="Completed">Completed</option>
                            </Input>
                        </ModalBody><hr/>

                        <h5 className="my-4">Edit Subtasks</h5>
                        {taskToEdit.subtasks.map((subtask,index) => (
                            <div key={subtask.subtask_id} className="mt-2">
                                <ModalBody>
                                    <Label className='fs-5 fw-medium'>Subtask {index+1}</Label>
                                    <Input
                                        type="text"
                                        value={subtask.subtask_title}
                                        onChange={(e) => handleSubtaskChange(subtask.subtask_id, 'subtask_title', e.target.value)}
                                        placeholder="Subtask Title"
                                    /></ModalBody>
                                <ModalBody>
                                    <Label className='fs-5 fw-medium'>Status</Label>
                                    <Input
                                        type="select"
                                        value={subtask.subtask_status}
                                        onChange={(e) => handleSubtaskChange(subtask.subtask_id, 'subtask_status', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="Todo">Todo</option>
                                        <option value="In progress">In progress</option>
                                        <option value="Completed">Completed</option>
                                    </Input>
                                </ModalBody><hr/>
                            </div>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button className='btn border-opacity-50 border-dark btn-info' onClick={saveTaskEdit}>
                            Save
                        </Button>
                        <Button className='btn border-opacity-50 border-dark btn-light' onClick={() => setEditModal(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={filteredData.length} handlePageChange={handlePageChange} />
        </div>
    )
}

