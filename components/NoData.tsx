import React from "react";
import Image from "next/image";
import nodatapic from "@/public/nodata1.png";
const NoData = () => {
  return (
    <>
      <div className='flex justify-center my-5 '>
        <div className="flex flex-col justify-center">
          <Image src={nodatapic} alt="no data"  />
          <h3 className="text-3xl mt-2  text-center">No data available!</h3>
        </div>
      </div>
    </>
  );
};

export default NoData;
