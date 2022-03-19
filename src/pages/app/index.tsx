
import { Task } from "@prisma/client";
import { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { prisma } from "../../lib/prisma";

type TasksProps = {
    tasks: Task[]
}

export default function App ({ tasks }: TasksProps) {

    const [newTask, setNewTask] = useState('')
    const [myTasks, setMyTasks] = useState(tasks)
    const router = useRouter()
    
    async function handleCreateTask (e: FormEvent) {
        e.preventDefault()

        const res = await fetch('http://localhost:3000/api/tasks/create', {
            method: 'POST',
            body: JSON.stringify({ title: newTask }),
            headers: {
                'Content-type': 'application/json'
            }
        })

        console.log(res.status)

        if (res.status < 300) {
            return router.reload()
        }
        
    }
    

    return (
        <div>
            <h1 className="text-4xl font-semibold">hello world</h1>
            <button onClick={() => signOut({ redirect: true })}>Sair</button>
            
            <div className="mt-10">
                <ul>
                    {myTasks.map(task => <li className="text-6xl" key={task.id}>{ task.title }</li>)}
                </ul>
                <form action="" onSubmit={handleCreateTask}>
                    <input  type="text" className="border-2 border-black" value={newTask} onChange={e => setNewTask(e.target.value)} />
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const tasks = await prisma.task.findMany()    

    const data = tasks.map(task => {
        return {
            id: task.id,
            title: task.title,
            isDone: task.isDone,
            date: task.createdAt.toISOString()
        }
    })

    return {
        props: {
            tasks: data
        }
    }
}