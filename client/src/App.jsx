import { Suspense } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { appRoutes } from "./appRoutes";

function App() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <span className="text-gray-700 text-lg">Loading...</span>
            </div>
          </div>
        }
      >
        <BrowserRouter>
          <Routes>
            {appRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
