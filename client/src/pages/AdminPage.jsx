import { useLocation } from 'react-router-dom';
import AdminLayout from "../components/admin-dashboard/AdminLayout";
import DashboardHome from "../components/admin-dashboard/DashboardHome";
import MasterclassesList from "../components/masterclassHandler/MasterclassesList";
import StudentsOverview from '../components/studentHandler/StudentsOverview';



const AdminPage = () => {
  const location = useLocation();
  const pathname = location.pathname;

  let ContentComponent;

  switch (pathname) {
    case '/admin-home':
      ContentComponent = <DashboardHome />;
      break;
    case '/admin-home/masterclasses':
      ContentComponent = <MasterclassesList />;
      break;
    case '/admin-home/students':
      ContentComponent = <StudentsOverview/>;
      break;
    default:
      ContentComponent = <div className="text-center p-4">404 - Page Not Found</div>;
      break;
  }

  return <AdminLayout>{ContentComponent}</AdminLayout>;
};

export default AdminPage;
