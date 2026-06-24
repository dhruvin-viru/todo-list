import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik'
import * as Yup from 'yup'

function Todo() {
    // localStorage.clear()    
    const [todo, settodo] = useState([])
    const [filter, setfilter] = useState('All')
    // const [sort, setsort] = useState('None')

    const init = {
        title: '',
        desc: '',
        priority: 'Low'
    }

    const validate = Yup.object({
        title: Yup.string().min(2).max(15).required('Fill All Field'),
        desc: Yup.string().min(2).max(30).required('Fill All Field'),
        priority: Yup.string().required('Fill All Field')
    })

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: init,
        validationSchema: validate,
        onSubmit: (values) => {
            addtask(values)
        }
    })

    const getdata = () => {
        const temp = JSON.parse(localStorage.getItem('Tasks'))
        if (filter === 'All') {
            settodo(temp)
        } else {
            settodo(temp.filter((task) => task.status === filter))
        }
    }

    useEffect(() => {
        const check = localStorage.getItem('Tasks')
        if (check == null) {
            localStorage.setItem('Tasks', JSON.stringify([]))
        }
        getdata()
    }, [])

    const addtask = (formValues) => {
        const value1 = (formValues?.title ?? '').trim()
        const value2 = (formValues?.desc).trim()
        const value3 = (formValues?.priority ?? 'Low').trim()
        if (!value1 || !value2) return
        const oldtasks = JSON.parse(localStorage.getItem('Tasks'))
        const newTasks = [...oldtasks, { title: value1, desc: value2, priority: value3, status: 'Active' }]
        localStorage.setItem('Tasks', JSON.stringify(newTasks))
        toast.success('Task added', { position: 'bottom-right', autoClose: 2000, theme: 'colored' })
        getdata()
    }

    const deletedata = (index) => {
        let temp = JSON.parse(localStorage.getItem('Tasks'))
        let updated = temp.filter((val, i) => i !== index)
        localStorage.setItem('Tasks', JSON.stringify(updated))
        toast.error('Task Deleted!', { position: 'bottom-right', autoClose: 2000, theme: 'colored' })
        getdata()
    }

    const editdata = (index) => {
        let temp = JSON.parse(localStorage.getItem('Tasks'))
        let updated = temp.filter((i) => i !== index)
        localStorage.setItem('Tasks', JSON.stringify(updated))
        getdata()
        toast.info('Editing task', { position: 'bottom-right', autoClose: 1800, theme: 'colored' })
    }

    const changestatus = (i) => {
        const temp = JSON.parse(localStorage.getItem('Tasks'))
        const updated = temp.map((val, index) => {
            if (index === i) {
                return { ...val, status: val.status === 'Active' ? 'Complete' : 'Active' }
            }
            return val
        })
        localStorage.setItem('Tasks', JSON.stringify(updated))
        getdata()
    }

    const filterdata = (e) => {
        const selectedFilter = e.target.value || 'All'
        setfilter(selectedFilter)
        const temp = JSON.parse(localStorage.getItem('Tasks'))
        const filtereddata = selectedFilter === 'All'
            ? temp
            : temp.filter((value) => value.status === selectedFilter)
        settodo(filtereddata)
    }

    const sortpr = (e) => {
        const selectedsort = e.target.value || 'None'
        const temp = JSON.parse(localStorage.getItem('Tasks'))

        const num = { 'Low': 1, 'Medium': 2, 'High': 3 }
        const sortdata = selectedsort === 'None'
            ? temp
            : [...temp].sort((a, b) => {
                const numA = num[a.priority];
                const numB = num[b.priority];
                if (selectedsort === 'LTH') {
                    return numA - numB;
                } else {
                    return numB - numA;
                }
            })
        settodo(sortdata)
    }
    return (
        <div className="app-container" role="region" aria-label="Todo app">
            <h1>Todo List</h1>

            <div>
                <form onSubmit={handleSubmit} className='input-row'>
                    <input
                        type="text"
                        aria-label="Task"
                        placeholder="Add a new task..."
                        onChange={(e) => {
                            handleChange(e)
                        }}
                        value={values.title}
                        name='title'
                        onBlur={handleBlur}
                    />
                    {(errors.title && touched.title) && <font color='red'>{errors.title}</font>}
                    <input
                        type='text'
                        aria-label='Desc'
                        placeholder='Add Description'
                        onChange={(e) => {
                            handleChange(e)
                        }}
                        value={values.desc}
                        name='desc'
                        onBlur={handleBlur}
                    />
                    {(errors.desc && touched.desc) && <font color='red'>{errors.desc}</font>}
                    <select
                        value={values.priority}
                        onChange={(e) => {
                            handleChange(e)
                        }}
                        name='priority'
                        onBlur={handleBlur}>
                        <option value='Low'>Low</option>
                        <option value='Medium'>Medium</option>
                        <option value='High'>High</option>
                    </select>
                    <button className="btn" type='submit'>Add Task</button>
                </form>
            </div>

            <div className="meta-row">
                <div className="count">{(todo || []).length} tasks</div>
                <div>
                    <select onChange={(e) => { sortpr(e) }}>
                        <option value='None'>Select Sort</option>
                        <option value="LTH">Low To High</option>
                        <option value="HTL">High To Low</option>
                    </select>
                </div>
                <div>
                    <select value={filter} onChange={(e) => { filterdata(e) }}>
                        <option value="All">All</option>
                        <option value='Active'>Active</option>
                        <option value='Complete'>Complete</option>
                    </select>
                    <button className="btn btn-outline" onClick={getdata}>Refresh</button>
                </div>
            </div>

            {todo && todo.length > 0 ? (
                <table className="todo-table" aria-label="Tasks list">
                    <thead>
                        <tr>
                            <td>Title</td>
                            <td>Description</td>
                            <td>Priority</td>
                            <td>Status</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {todo.map((val, i) => (
                            <tr className="todo-row" key={i}>
                                <td>
                                    <div className="todo-item">{val.title}</div>
                                </td>
                                <td>
                                    <div>{val.desc}</div>
                                </td>
                                <td>
                                    <div>{val.priority}</div>
                                </td>
                                <td>
                                    <div>
                                        <button onClick={() => { changestatus(i) }}>{val.status}</button>
                                    </div>
                                </td>
                                <td style={{ width: 1 }}>
                                    <div className="todo-actions">
                                        <button className="action-btn delete" onClick={() => deletedata(i)}>Delete</button>
                                        <button className="action-btn" onClick={() => editdata(i)}>Edit</button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="empty">No tasks yet. Add your first task above.</div>
            )}

            <ToastContainer />
        </div>
    )
}

export default Todo