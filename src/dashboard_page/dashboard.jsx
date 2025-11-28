import smoke_bg from '../assets/smoke_bg.svg'
import Dashboard_panel from './dashboard_panel';

function Dashboard(){

    return(<>   
        <div className="w-full h-screen flex justify-center items-center">
            <Dashboard_panel/>
        </div>
    </>);

}

export default Dashboard;