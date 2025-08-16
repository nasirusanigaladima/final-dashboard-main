
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";

function Analytics() {
  const chartRef = useRef(null);

  useEffect(() => {
    let Chart;
    let chartInstance;
    async function loadChart() {
      Chart = (await import('chart.js/auto')).default;
      if (chartRef.current) {
        chartInstance = new Chart(chartRef.current, {
          type: 'bar',
          data: {
            labels: ['Math', 'Biology', 'Physics', 'Chemistry', 'CS'],
            datasets: [
              {
                label: 'Average Score',
                data: [78, 85, 90, 70, 95],
                backgroundColor: [
                  'rgba(59,130,246,0.7)',
                  'rgba(34,197,94,0.7)',
                  'rgba(253,224,71,0.7)',
                  'rgba(239,68,68,0.7)',
                  'rgba(99,102,241,0.7)'
                ],
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true },
              title: {
                display: true,
                text: 'Course Average Scores',
                color: '#fff',
                font: { size: 18 }
              },
            },
            scales: {
              x: {
                ticks: { color: '#fff' },
                grid: { color: 'rgba(255,255,255,0.1)' }
              },
              y: {
                ticks: { color: '#fff' },
                grid: { color: 'rgba(255,255,255,0.1)' }
              }
            }
          },
        });
      }
    }
    loadChart();
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, []);

  // Load student data and calculate metrics based on enrolled students
  const [studentStats, setStudentStats] = useState({ support: 0, excelling: 0, avgGpa: 0, total: 0 });
  useEffect(() => {
    async function fetchStats() {
      try {
        const [enrollmentsResponse, studentsResponse] = await Promise.all([
          fetch('/enrollments.csv'),
          fetch('/students.csv')
        ]);

        if (!enrollmentsResponse.ok || !studentsResponse.ok) {
          throw new Error('HTTP error! Failed to fetch CSV data.');
        }

        const enrollmentsText = await enrollmentsResponse.text();
        const studentsText = await studentsResponse.text();

        const enrollmentsResults = Papa.parse(enrollmentsText, { header: true, skipEmptyLines: true });
        const studentsResults = Papa.parse(studentsText, { header: true, skipEmptyLines: true });

        const studentsMap = new Map(studentsResults.data.map(student => [student.StudentID, student]));
        
        const enrolledStudentIds = new Set(enrollmentsResults.data.map(e => e.StudentID));

        let support = 0, excelling = 0, gpaSum = 0, count = 0;

        for (const studentId of enrolledStudentIds) {
            const student = studentsMap.get(studentId);
            if (student && student.GPA) {
                const gpa = parseFloat(student.GPA);
                if (!isNaN(gpa)) {
                    count++;
                    gpaSum += gpa;
                    if (gpa <= 2.0) support++;
                    if (gpa >= 3.5) excelling++;
                }
            }
        }

        setStudentStats({ support, excelling, avgGpa: count ? (gpaSum/count).toFixed(2) : 0, total: count });
      } catch (e) {
        console.error("Failed to fetch or process student stats:", e);
        setStudentStats({ support: 0, excelling: 0, avgGpa: 0, total: 0 });
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-start py-10">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 w-full max-w-4xl mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Analytics Dashboard</h1>
          <div className="mb-8">
            <h2 className="text-xl text-white font-semibold mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-200 mb-2">{studentStats.total}</div>
                <div className="text-white">Total Students</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-green-200 mb-2">{studentStats.avgGpa}</div>
                <div className="text-white">Average GPA</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center cursor-pointer hover:bg-opacity-40 transition" onClick={() => window.location.href='/enrollment?filter=support'}>
                <div className="text-4xl font-bold text-yellow-200 mb-2">{studentStats.support}</div>
                <div className="text-white underline">Students Needing Support</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center cursor-pointer hover:bg-opacity-40 transition" onClick={() => window.location.href='/enrollment?filter=excelling'}>
                <div className="text-4xl font-bold text-green-200 mb-2">{studentStats.excelling}</div>
                <div className="text-white underline">Students Excelling</div>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl text-white font-semibold mb-4">Interactive Bar Chart</h2>
            <div className="w-full h-[400px] bg-white bg-opacity-10 rounded-xl flex items-center justify-center">
              <canvas ref={chartRef} style={{ maxWidth: '700px', maxHeight: '350px' }} />
            </div>
          </div>
        </div>
      <Footer />
      </div>
    </>
  );
}

export default Analytics;
