import { Link } from 'react-router-dom';

function Title(){

    return(
    <>
        <div className="text-center text-white mt-20">
            <h1 className="text-6xl font-bold">Credenza</h1>
            <h2 className="text-4xl mt-3">Student Org Certificate Generator</h2>
            <div className="mt-15">
                <Link to='/login'><div className="inline-block bg-white text-black text-2xl px-6 py-3 rounded-full shadow-md cursor-pointer">Get Started</div></Link>
            </div>
        </div>
    </>
    );

}

export default Title;