import React, { useEffect, useState } from 'react'
import { mapTaskDetails } from '../../data/taskDetails';
import FormCard from './form-card';
import Button from '../../components/button';
import { updateTask } from '../../services/tasks/tasks';
import { sendErrorNotification, sendSuccessNotification } from '../../services/notifications';
import { getAllEmployees } from '../../services/employees/allEmployees';

const TaskDetailsForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [{ allFields, initialState }, setTaskDetails] = useState(mapTaskDetails([], props.details));

  useEffect(()=> {
    const syncRequiredData = async () => {
      setIsLoading(true);
      const allEmployees = await getAllEmployees();
      setTaskDetails(mapTaskDetails(allEmployees.body.data, props.details));
      setIsLoading(false);
    }
    syncRequiredData();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const [title, start_date, due_date, status, assigned_to] = allFields.map((item)=> item.value);
    const details = { title, start_date, due_date, status, assigned_to };
    const result = await updateTask(initialState._id, details);
    if(result.status === 'success'){
      sendSuccessNotification('The task has been updated successfully');
      props.closeModal();
      props.fetchTasks();
    }else{
      sendErrorNotification(result.message);
    }
    setIsLoading(false);
  }

  const formItems = allFields?.map((item, index) => ({
    label: item.label,
    value: item.value,
    type: item.type,
    ...item.details,
    onChange: ({ target: { value } }) => {
      const list = allFields.map((item)=> item);
      list[index].value = value;
      setTaskDetails((prev)=> ({
        ...prev, 
        allFields: list
      }));
    }
  }));

  return (
    <div className='task-details-form'>
      <FormCard items={formItems} />
      <div className="task-details-btns">
        <Button text="Cancel" onClickBtn={props.closeModal}/>
        <Button 
          text={isLoading ? "...Saving" : "Save Changes" }
          button="primary" 
          onClickBtn={handleSubmit}
        />
      </div>
    </div>
  )
}

export default TaskDetailsForm