import generation from '../assets/about_images/generation_image.svg'
import cloud from '../assets/about_images/cloud_image.svg'
import customizability from '../assets/about_images/customize_image.svg'
import email from '../assets/about_images/email_image.svg'

function About(){

    return(
    <>
        <div className="flex flex-wrap justify-center items-center w-full mt-75 mb-25 gap-10">
            <div className="relative about-card group w-150 h-80 rounded-3xl border-2 border-gray-300 content-end p-10 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]">
                <img src={generation} alt="test" className="about-image w-100 absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]"/>
                <h1 className="text-white text-4xl font-bold absolute bottom-10 left-10">Easy Generation</h1>
            </div>
            <div className="relative about-card group w-150 h-80 rounded-3xl border-2 border-gray-300 content-end p-10 transition-all duration-300 hover:border-pink-400 hover:shadow-[0_0_25px_rgba(255,0,255,0.4)]">
                <img src={customizability} alt="test" className="about-image w-100 absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,0,255,0.8)]"/>
                <h1 className="text-white text-4xl font-bold absolute bottom-10 left-10">Customizability</h1>
            </div>
            <div className="relative about-card group w-150 h-80 rounded-3xl border-2 border-gray-300 content-end p-10 transition-all duration-300 hover:border-yellow-400 hover:shadow-[0_0_25px_rgba(255,255,0,0.4)]">
                <img src={cloud} alt="test" className="about-image w-100 absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,0,0.8)]"/>
                <h1 className="text-white text-4xl font-bold absolute bottom-10 left-10">Cloud Integration</h1>
            </div>
            <div className="relative about-card group w-150 h-80 rounded-3xl border-2 border-gray-300 content-end p-10 transition-all duration-300 hover:border-orange-400 hover:shadow-[0_0_25px_rgba(255,165,0,0.4)]">
                <img src={email} alt="test" className="about-image w-100 absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,165,0,0.8)]"/>
                <h1 className="text-white text-4xl font-bold absolute bottom-10 left-10">Certificate Distribution</h1>
            </div>
      </div>
    </>
    );

}

export default About;