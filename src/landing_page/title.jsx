import { Link } from 'react-router-dom';

function Title(){

    return(
    <>
        <div className="text-center text-white w-full h-[80vh] flex flex-col pt-40 select-none">
            <h1 className="text-6xl font-bold">Credenza</h1>
            <h2 className="text-4xl mt-3">Certificates made simple.</h2>
            <div className="mt-15">
                <Link to='/login'><div className="inline-block bg-white text-black text-2xl px-6 py-3 rounded-full shadow-md cursor-pointer">Get Started</div></Link>
            </div>
        </div>
    </>
    );

}

export default Title;