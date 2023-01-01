import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { useEffect, useState } from 'react';


const AvailableMeals = () => {
  const[meals, setMeals]= useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  //fetch meals data from db
  useEffect(()=>{
  const fetchMeals = async () =>{
    const response = await fetch('https://react-req-93ea7-default-rtdb.firebaseio.com/meals.json');
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    //get data in loadedMeals array
    const loadedMeals =[];
    for (const key in responseData) {
      loadedMeals.push({
        id: key,
        name: responseData[key].name,
        description: responseData[key].description,
        price: responseData[key].price,
      });
    }
    setMeals(loadedMeals); // we'll have all the data from our db inside meals array
    setIsLoading(false);
  };

/*

fetchMeals is an async function and hence it always returns a promise, now if we throw an error instead of promise, that
error will cause the promise to reject. So normal try catch can't work inside useEffect.

  try{
    //fetchMeals();
    await fetchMeals();
    //doing this will also not work because now if we make this function call asynchronously then we'll have to make the main function of useEffect async ()=>{} too
    which we're not allowed to do.
  }catch(error){
    setIsLoading(false);
    setHttpError(error.message);
  }
*/

  //So this is, promise only way to handle error inside useEffect,  
  fetchMeals().catch((error) => {
    setIsLoading(false);
    setHttpError(error.message);
  });
},[]);

if (isLoading) {
  return (
    <section className={classes.MealsLoading}>
      <p>Loading...</p>
    </section>
  );
}

if (httpError) {
  return (
    <section className={classes.MealsError}>
      <p>{httpError}</p>
    </section>
  );
}
  const mealsList = meals.map((meal) => (
    <MealItem
      id={meal.id}
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;