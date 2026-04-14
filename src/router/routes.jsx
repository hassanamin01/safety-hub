import { createBrowserRouter } from "react-router-dom";
import SafetyHubHomeScreen from "../screens/SafetyHubHomeScreen";
import SafetyMetricsScreen from "../screens/SafetyMetricsScreen";
import MobileIncidentsScreen from "../screens/MobileIncidentsScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SafetyHubHomeScreen />,
  },
  {
    path: "/metrics",
    element: <SafetyMetricsScreen />,
  },
  {
    path: "/mobile",
    element: <MobileIncidentsScreen />,
  },
]);

export default router;
