import React, { useState } from 'react';
import {Minus,Plus,RefreshCw} from 'lucide-react';
import "./index.css";

const Counter = ({title,initialValue,themecolor,onReset})=>
{
  const[count,setCount]=useState(initialValue);

  const increment=()=>{
    setCount(count+1);
  }
  const decrement=()=>{
    setCount(count-1);
  }

  const resetlocal=()=>{
    setCount(initialValue);
  };

  const buttonClass = "px-4 py-4 text-white font-semibold rounded-full  shadow-lg";
  const cardClass = "bg-green p-6 md:p-8 rounded-2xl shadow-2xl";

  return(
    <div className={cardClass}>
      <h2 className="text-2xl font-bold md-4 text-gray-800 border-b">
        {title}
      </h2>

      <div className="text-7xl font-mono my-8">
        {count}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={decrement}
           className={`${buttonClass} + w-12 h-12 bg-red-500`}
          disabled = {count<=0}
        >
          <Minus size={20}/>
        </button>

        <button
          onClick={increment}
          className={`${buttonClass} + w-12 h-12 bg-green-500`}
        >
          <Plus size={20}/>
        </button>
        <button
          onClick={resetlocal}
          className="mt-6 w-full flex justify-center space-x-2 text-gray-600"
        >
          <RefreshCw size={20}/>
        </button>
      </div>
    </div>
  )
};
export default function App(){
  const handleChildReset = (counterTitle) =>{
    console.log(`[Parent log]: Counter' ${counterTitle} "was reset"`)
  };

  return(
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 item-center">
      <h1 className="text-4xl font-black text-gray-900 mb-10 border-green-500">
        React Fundamentals Demo
      </h1>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Counter
          title = "Primary Button"
          initialValue={5}
          themecolor="bg-blue-400"
          onReset={handleChildReset}
        />

        <Counter
          title="Secondary Button"
          initialValue={5}
          themecolor="bg-red-500"
          onReset={handleChildReset}
        />
      </div>
    </div>
  )
}