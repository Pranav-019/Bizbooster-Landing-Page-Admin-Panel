import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsCurrencyRupee } from 'react-icons/bs';
import { GoDot } from 'react-icons/go';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Button, LineChart, SparkLine } from '../Components';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useStateContext } from '../Contexts/ContextProvider';
import { Header } from "../Components"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const dropdownData = [
  { Time: 'Last Week', Id: '1' },
  { Time: 'Last Month', Id: '2' },
  { Time: 'Last Year', Id: '3' },
];

const DropDown = ({ currentMode }) => (
  <div className="dropdown-container">
    <DropDownListComponent
      id="time"
      fields={{ text: 'Time', value: 'Id' }}
      style={{ border: 'none', color: currentMode === 'Dark' && 'white' }}
      value="1"
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth="120px"
    />
  </div>
);

const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();
  const [orderData, setOrderData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://Artisticify-backend.vercel.app/api/orders')
      .then((response) => {
        setOrderData(response.data);
        processSalesData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
        setLoading(false);
      });
  }, []);

  const processSalesData = (orders) => {
    const sales = orders.map((order) => ({
      service: order.serviceSelected,
      amountPaid: order.amountPaid,
      totalAmount: order.totalAmount,
      remainingAmount: order.totalAmount - order.amountPaid,
    }));
    setSalesData(sales);
  };

  const calculateTotalRevenue = () =>
    salesData.reduce((total, sale) => total + sale.amountPaid, 0).toFixed(2);

  const calculateTotalRemainingAmount = () =>
    salesData.reduce((total, sale) => total + sale.remainingAmount, 0).toFixed(2);

  // Aggregate data for grouped charts
  const aggregatedData = salesData.reduce((acc, sale) => {
    const service = acc[sale.service] || { total: 0, paid: 0 };
    service.total += sale.totalAmount;
    service.paid += sale.amountPaid;
    acc[sale.service] = service;
    return acc;
  }, {});

  const groupedBarData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: 'Total Amount',
        data: Object.values(aggregatedData).map((data) => data.total),
        backgroundColor: '#007bff',
      },
      {
        label: 'Amount Paid',
        data: Object.values(aggregatedData).map((data) => data.paid),
        backgroundColor: '#28a745',
      },
    ],
  };

  const groupedBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  const multiLineData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: 'Amount Paid',
        data: Object.values(aggregatedData).map((data) => data.paid),
        borderColor: '#ff6384',
        tension: 0.4,
      },
      {
        label: 'Remaining Amount',
        data: Object.values(aggregatedData).map(
          (data) => data.total - data.paid
        ),
        borderColor: '#36a2eb',
        tension: 0.4,
      },
    ],
  };

  const multiLineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  const pieChartData = {
    labels: ['Amount Paid', 'Remaining Amount'],
    datasets: [
      {
        data: [
          salesData.reduce((total, sale) => total + sale.amountPaid, 0),
          salesData.reduce((total, sale) => total + sale.remainingAmount, 0),
        ],
        backgroundColor: ['#28a745', '#ff4b5c'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Container fluid className="mt-4">
        <Header category="" title="Revenue" />
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col xs={12} sm={6} lg={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-muted h6">Earnings</Card.Title>
                  <div className="d-flex align-items-center">
                    <BsCurrencyRupee className="fs-5" />
                    <span className="h4 mb-0 ms-2">{calculateTotalRevenue()}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs={12} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center mb-4">Revenue Distribution</Card.Title>
                  <div style={{ height: '300px' }}>
                    <Pie 
                      data={pieChartData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center mb-4">Payment Trends</Card.Title>
                  <div style={{ height: '300px' }}>
                    <Line 
                      data={multiLineData} 
                      options={{
                        ...multiLineOptions,
                        maintainAspectRatio: false,
                        responsive: true
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center mb-4">Service-wise Revenue</Card.Title>
                  <div style={{ height: '300px' }}>
                    <Bar 
                      data={groupedBarData} 
                      options={{
                        ...groupedBarOptions,
                        maintainAspectRatio: false,
                        responsive: true
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Ecommerce;
