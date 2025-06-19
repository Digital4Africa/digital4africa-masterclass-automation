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
import { fetchCohorts } from '../features/cohorts/cohortsSlice';
import CohortList from '../components/cohortHandler/CohortList';
import PaymentsPage from './PaymentsPage';



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
    case '/admin-home/cohorts':
      ContentComponent = <CohortList />;
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
    case '/admin-home/payments':
      ContentComponent = <PaymentsPage/>;
      break;
      default:
      ContentComponent = <div className="text-center p-4">404 - Page Not Found</div>;
      break;
  }
  useEffect(() => {
    dispatch(fetchMasterclasses());
    dispatch(fetchCohorts())
  }, [dispatch]);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_SOCKET_URL);

    ws.onopen = () => {
      console.log('✅ Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📩 Message from server:', data);

      // Handle events
      if (data.type === 'NEW_COHORT_CREATED') {
        dispatch(fetchCohorts());
      }

      if (data.type === 'ENROLLMENT_CONFIRMATION') {
        dispatch(fetchCohorts());
      }
    };

    ws.onclose = () => {
      console.log('❌ WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [dispatch]);

  return <AdminLayout>{ContentComponent}</AdminLayout>;
};

export default AdminPage;
