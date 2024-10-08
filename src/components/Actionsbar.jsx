import React, { useState } from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import { TaskTable } from './TaskTable';
import { NewTask } from './NewTask';


export const Actionsbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [addTask, setAddTask] = useState(false)
    const [search, setSearch] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [sort, setSort] = useState("")
    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState)
    };
    const toggleAddTask = () => {
        setAddTask((prevState) => !prevState)
    };
    const handleTaskAdded = () => {
        setRefresh((prevState) => !prevState)
    };
    const handleSort = (sortType) => {
        setSort(sortType)
    }
    return (
        <>
            <div className='actionsbar'>
                <input className='filter-searchbar' type='search' name='filter-search' value={search} placeholder='Filter tasks...' onChange={(e) => setSearch(e.target.value)} />
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle className='dropdown' caret>
                        Sort by&nbsp;
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => handleSort('title')}>Task title</DropdownItem>
                        <DropdownItem onClick={() => handleSort('subtask_title')}>Subtask title</DropdownItem>
                        <DropdownItem onClick={() => handleSort('status')}>Status</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <button className='addtask-button' onClick={toggleAddTask}>+ Add New Task</button>
            </div>
            <div className='px-3'>
                <TaskTable search={search} refresh={refresh} sort={sort} />
            </div>
            <Modal isOpen={addTask} toggle={toggleAddTask}>
                <ModalHeader toggle={toggleAddTask}>Add New Task</ModalHeader>
                <ModalBody>
                    <NewTask handleTaskAdded={handleTaskAdded} toggleAddTask={toggleAddTask} />
                </ModalBody>
            </Modal>
        </>
    )
}
