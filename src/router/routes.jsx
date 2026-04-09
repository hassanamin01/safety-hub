import { createBrowserRouter } from "react-router-dom";
import SafetyHubHomeScreen from "../screens/SafetyHubHomeScreen";
import SafetyMetricsScreen from "../screens/SafetyMetricsScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SafetyHubHomeScreen />,
  },
  {
    path: "/metrics",
    element: <SafetyMetricsScreen />,
  },
]);

export default router;
