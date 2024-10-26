import { FcFullTrash, FcEditImage } from "react-icons/fc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const fetchTasks = async () => {
  const { data } = await axios.get("https://json-api-wsnl.onrender.com/tasks");
  return data;
};

const addTaskMutation = async (inp) => {
  try {
    await axios.post("https://json-api-wsnl.onrender.com/tasks", inp);
  } catch (error) {
    console.log(error);
  }
};

const deleteTaskMutation = async (id) => {
  try {
    await axios.delete(`https://json-api-wsnl.onrender.com/tasks/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const editTaskMutation = async (Inp) => {
  try {
    await axios.patch(`https://json-api-wsnl.onrender.com/tasks/${Inp.id}`, {
      task: Inp.task,
    });
  } catch (error) {
    console.log(error);
  }
};

function App() {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const addMutation = useMutation({
    mutationFn: addTaskMutation,
    onSuccess: () => {
      setInp({ task: "" });
      queryClient.invalidateQueries("tasks");
    },
  });

  const delMutation = useMutation({
    mutationFn: deleteTaskMutation,
    onSuccess: () => {
      setInp({ task: "" });
      queryClient.invalidateQueries("tasks");
      console.log(data);
    },
  });

  const editMutation = useMutation({
    mutationFn: editTaskMutation,
    onSuccess: () => {
      setInp({ task: "" });
      queryClient.invalidateQueries("tasks");
    },
  });

  const [Inp, setInp] = useState({
    task: "",
  });
  const [updateBtn, setBtn] = useState(false);


  const handleAdd = (Inp) => {
    if(Inp.task.trim()!=='')
    addMutation.mutate(Inp);
  };

  const handleDelete = (id) => {
    delMutation.mutate(id);
  };

  const handleEdit = (inp) => {
    setInp(inp);
    setBtn(true);
  };

  const handleUpdate = () => {
    if(Inp.task.trim()!==''){
      editMutation.mutate(Inp);
      setBtn(false);
    }
  };

  return (
    <>
      <div className="w-1/2 text-center  mx-auto">
        <h1 className="text-3xl font-bold mt-8">Task Manager</h1>
        <div className="py-4 my-10 border bg-blue-200 rounded flex flex-wrap justify-center gap-x-10">
          <input
            className="h-10 border px-6"
            onChange={(e) => setInp({ ...Inp, task: e.target.value })}
            type="text"
            value={Inp.task}
            placeholder="Enter Task Here"
          />
          <div className="flex justify-center items-center gap-x-4">
            {!updateBtn ? (
              <button
                className="bg-gray-200 p-1 font-bold rounded"
                onClick={() => handleAdd(Inp)}
              >
                Add Task
              </button>
            ) : (
              <button
                className="bg-green-100 p-1 font-semibold rounded"
                onClick={() => handleUpdate()}
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>Error...{error.message}</h1>
      ) : (
        data?.map((ele, i) => {
          return (
            <div
              key={i}
              className="w-1/2 my-2 mx-auto flex justify-between items-center gap-x-1 border p-2"
            >
              <p className="w-3/4 text-center font-bold">{ele.task}</p>
              <button
                className="border  bg-red-400 flex items-center px-1 rounded"
                onClick={() => handleDelete(ele.id)}
              >
                <FcFullTrash className="text-3xl" />
                Delete
              </button>
              <button
                className="border flex items-center px-1"
                onClick={() => handleEdit(ele)}
              >
                <FcEditImage className="text-3xl" /> Edit
              </button>
            </div>
          );
        })
      )}
    </>
  );
}

export default App;
