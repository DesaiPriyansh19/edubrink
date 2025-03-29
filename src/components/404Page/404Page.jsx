import React from 'react';

import notFoundImg from '../../assets/Frame 2121458429.png';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-auto text-center">
      <div className="w-60 my-3 p-0">
        <img src={notFoundImg} alt="Not Found"  className="rounded-lg w-full h-full " />
      </div>
      <h2 className="text-2xl font-semibold mt-4">Oops!</h2>
      <p className="text-gray-600 mt-2">We couldn’t find the page you were looking for now.</p>
    <Link to={"/"}> <button className="mt-4 px-6 py-2 bg-black text-sm text-white rounded-3xl hover:bg-gray-800">
        Go Back to Home
      </button></Link> 
    </div>
  );
}

export default NotFoundPage;
