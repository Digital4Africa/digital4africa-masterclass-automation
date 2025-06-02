import { useLocation } from 'react-router-dom';
import AdminLayout from "../components/admin-dashboard/AdminLayout";
import DashboardHome from "../components/admin-dashboard/DashboardHome";
import MasterclassesList from "../components/masterclassHandler/MasterclassesList";
import StudentsOverview from '../components/studentHandler/StudentsOverview';
import AddMasterclassForm from '../components/addMasterclass/AddMasterclassForm';
import { useEffect } from 'react';
import { fetchMasterclasses } from '../features/masterclass/fetchAllMasterclassesSlice';
import { useDispatch } from 'react-redux';
import EditMasterclassForm from '../components/editMasterclass/EditMasterclassForm';
import { useParams } from "react-router-dom";



const AdminPage = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch()
  const { masterclassId } = useParams();

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
    case '/admin-home/masterclasses/new':
      ContentComponent = <AddMasterclassForm/>;
      break;
    case `/admin-home/masterclasses/${masterclassId}/edit`:
      ContentComponent = <EditMasterclassForm/>;
      break;
    default:
      ContentComponent = <div className="text-center p-4">404 - Page Not Found</div>;
      break;
  }
  useEffect(() => {
    dispatch(fetchMasterclasses());
  }, [dispatch]);

  return <AdminLayout>{ContentComponent}</AdminLayout>;
};

export default AdminPage;
