import { useSelector } from 'react-redux';
import Header from '../components/landing-components/Header';
import LoadingSkeleton from '../components/landing-components/LoadingSkeleton';
import MasterclassCard from '../components/landing-components/MasterclassCard';
import EmptyState from '../components/landing-components/EmptyState';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Import the arrow icon

function Landing() {
  const { studentsCohorts, loading } = useSelector((state) => state.studentsCohorts);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,96,161,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,96,161,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Floating particles */}
      {/* {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-[#0060a1] rounded-full opacity-10 animate-pulse"
          style={{
            left: `${5 + (i * 8)}%`,
            top: `${10 + (i * 7)}%`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        ></div>
      ))} */}

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-6 py-12">
          {/* Back to Main Website Link - Added above Header */}
          <a
            href="https://digital4africa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#0060a1] hover:text-[#005589] mb-6 transition-colors duration-300 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Digital4Africa Website</span>
          </a>

          {/* Header Section */}
          <Header />

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <LoadingSkeleton />
            ) : studentsCohorts && studentsCohorts.length > 0 ? (
              <>
                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {studentsCohorts.map((cohort) => (
                    <MasterclassCard key={cohort.cohortId} cohort={cohort} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;