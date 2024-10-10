import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as workoutService from "../../services/workoutService";

const WorkoutForm = (props) => {
  const { workoutId } = useParams();

  const [formData, setFormData] = useState({
    workoutType: "",
    caloriesBurned: "", // Initialize as an empty string
  });

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const workoutData = await workoutService.show(workoutId);
        // Check if workoutData has the expected structure
        if (workoutData) {
          setFormData({
            workoutType: workoutData.workoutType || "",
            caloriesBurned: workoutData.caloriesBurned || "",
          });
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
      }
    }

    if (workoutId) {
      fetchWorkout();
    }
  }, [workoutId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // For caloriesBurned, convert value to number
    setFormData({
      ...formData,
      [name]: name === "caloriesBurned" ? Number(value) : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("formData", formData);

    if (workoutId) {
      // Update existing workout
      props.handleUpdateWorkout(workoutId, formData);
    } else {
      // Add new workout
      props.handleAddWorkout(formData);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>{workoutId ? "Edit Workout" : "New Workout"}</h1>
        <label htmlFor="workoutType-input">Workout</label>
        <input
          required
          type="text"
          name="workoutType"
          id="workoutType-input"
          value={formData.workoutType}
          onChange={handleChange}
        />
        <label htmlFor="caloriesBurned-input">Calories Burned</label>
        <input
          required
          type="number"
          name="caloriesBurned"
          id="caloriesBurned-input"
          value={formData.caloriesBurned}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default WorkoutForm;
