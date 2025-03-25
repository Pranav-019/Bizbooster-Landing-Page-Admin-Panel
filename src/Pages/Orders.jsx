import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Card,
  Form,
  ButtonGroup,
} from "react-bootstrap";
import { FaPen, FaFileDownload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/orders.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaEye } from "react-icons/fa";
import logoImage from '../Data/artisticify-logo.jpeg';
import { Header } from '../Components';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTab, setShowTab] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerEmail: "",
    city: "",
    phone: "",
    serviceSelected: "",
    packageSelected: "",
    amountPaid: "",
    message: "",
  });

  const generateInvoice = (order) => {
    const doc = new jsPDF();

    // Get page dimensions and calculate center position
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Calculate logo dimensions
    const imgProps = doc.getImageProperties(logoImage);
    const logoWidth = 40;
    const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
    
    // Calculate X position to center the logo
    const logoX = (pageWidth - logoWidth) / 2;
    
    // Add centered logo
    doc.addImage(logoImage, 'PNG', logoX, 10, logoWidth, logoHeight);

    // Add semi-transparent watermark
    const pageHeight = doc.internal.pageSize.getHeight();
    const watermarkWidth = 150;
    const watermarkHeight = (imgProps.height * watermarkWidth) / imgProps.width;
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.addImage(
      logoImage,
      'PNG',
      (pageWidth - watermarkWidth) / 2,
      (pageHeight - watermarkHeight) / 2,
      watermarkWidth,
      watermarkHeight
    );
    doc.setGState(new doc.GState({ opacity: 1 }));
  
    // Header Section
    doc.setFontSize(22);
    // doc.text("Artisticify", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("3rd Floor, 307 Amanora Chamber, Amanora Mall Hadapsar, Pune", 105, 30, { align: "center" });
    doc.text("City - Pune, State Maharashtra, ZIP - 411028", 105, 35, { align: "center" });
    doc.text("Phone:  +91-9112452929 | Email: info@Artisticify.com", 105, 40, { align: "center" });
    doc.text("----------------------------------------------------", 14, 45);
  
    // Invoice Header
    doc.setFontSize(18);
    doc.text("Invoice", 14, 55);
    doc.setFontSize(12);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 65);
    doc.text(`Order ID: ${order.orderId}`, 14, 70);
    doc.text(`Customer Name: ${order.customerName}`, 14, 75);
    doc.text(`Email: ${order.customerEmail}`, 14, 80);
    doc.text(`City: ${order.city}`, 14, 85);
    doc.text("----------------------------------------------------", 14, 90);
  
    // Order Details Table
    const tableStartY = 100;
    doc.text("Order Details", 14, tableStartY - 5);
    const columns = ["Service", "Package", "Total Amount", "Amount Paid"];
    const rows = [
      [order.serviceSelected, order.packageSelected, `${order.totalAmount}`, `${order.amountPaid}`],
    ];
  
    doc.autoTable({
      startY: tableStartY,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { 
        fontSize: 10,
        lineColor: [0, 0, 255], // RGB value for blue
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [255, 255, 255], // White background
        textColor: [0, 0, 0], // Black text
        lineColor: [0, 0, 0], // Blue border
      },
      bodyStyles: {
        lineColor: [0, 0, 0] // Blue border
      }
    });
  
    // Calculate remaining amount
    const remainingAmount = order.totalAmount - order.amountPaid;
    const paymentStatus = remainingAmount === 0 ? "Payment Completed" : `Remaining Amount: ${remainingAmount}`;
  
    // Remaining Amount and Notes Section
    const tableEndY = doc.lastAutoTable.finalY + 10;
    doc.text(paymentStatus, 14, tableEndY); // Display remaining amount or "Payment Completed"
    doc.setFontSize(12);
    doc.text(order.custom , 14, tableEndY + 10);
    doc.text(order.message || "Thank you for your business!", 14, tableEndY + 20);
  
    // Footer
    doc.setFontSize(10);
    doc.text("This is a system-generated invoice.", 14, 280);
    doc.text("For any queries, contact us at info@Artisticify.com.", 14, 285);
    doc.text("For Refund policies, refer to our website {link: 'www.Artisticify.com'}", 14, 290, );
  
    // Save the PDF
    doc.save(`Invoice-${order.orderId}.pdf`);
  };
  

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://Artisticify-backend.vercel.app/api/orders");
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters
  const applyFilter = (filterType) => {
    let filtered = [...orders];
    const now = new Date();

    switch (filterType) {
      case "today":
        filtered = filtered.filter(
          (order) => new Date(order.createdAt).toDateString() === now.toDateString()
        );
        break;
      case "thisWeek":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= startOfWeek
        );
        break;
      case "thisMonth":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= startOfMonth
        );
        break;
      case "customDate":
        if (startDate && endDate) {
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
            );
          });
        }
        break;
      case "all":
        filtered = orders;
        break;
      default:
        break;
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  // Update order status or add updates
  const updateOrderField = async (orderId, field, value) => {
    try {
      const response = await axios.put(`https://Artisticify-backend.vercel.app/api/orders/${orderId}`, { [field]: value }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${field}`);
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
      applyFilter("all");  // Refetch the orders after the update
      setUpdateSuccess(true);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  // Handle tab toggle for details or edit
  const handleTabToggle = (order, mode) => {
    setSelectedOrder(order);
    setShowTab({ [mode]: true });
    setUpdateSuccess(false);
  };

  // Handle new order creation
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://Artisticify-backend.vercel.app/api/orders", newOrder, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const createdOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, createdOrder]);
      setNewOrder({
        customerName: "",
        customerEmail: "",
        city: "",
        phone: "",
        serviceSelected: "",
        packageSelected: "",
        amountPaid: "",
        totalAmount: "",
        custom: "",
        message: "",
      });
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // Handle editing an order
  const handleEdit = (order) => {
    setEditingOrder(order);
  };

  const handleEditSubmit = async () => {
    try {
      console.log('Updating order status:', editingOrder.status);
      const response = await axios.put(
        `https://Artisticify-backend.vercel.app/api/orders/${editingOrder._id}`,
        { orderStatus: editingOrder.status }
      );
      
      if (response.status === 200) {
        console.log('Order status updated successfully');
        setOrders(orders.map(order => 
          order._id === editingOrder._id ? { ...order, status: editingOrder.status } : order
        ));
        setFilteredOrders(filteredOrders.map(order => 
          order._id === editingOrder._id ? { ...order, status: editingOrder.status } : order
        ));
        setUpdateSuccess(true);
        setTimeout(() => {
          setUpdateSuccess(false);
          setEditingOrder(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleEditChange = (value) => {
    setEditingOrder(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleGenerate = (orderId) => {
    console.log('Generate invoice for order:', orderId);
  };

  const renderMobileCard = (order) => (
    <div className="mobile-order-card mb-3 p-3 bg-white rounded shadow-sm" key={order._id}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 className="mb-1">{order.customerName}</h6>
          <p className="mb-1 text-muted small">{order.phone}</p>
        </div>
        <span className={`order-status-badge ${order.orderStatus?.toLowerCase().replace(' ', '-')}`}>
          {order.orderStatus}
        </span>
      </div>
      
      <div className="mobile-order-details">
        <p className="mb-1 small"><strong>Service:</strong> {order.serviceSelected}</p>
        <p className="mb-1 small"><strong>Email:</strong> {order.customerEmail}</p>
        <p className="mb-1 small"><strong>Amount:</strong> ₹{order.amountPaid}</p>
        <p className="mb-0 small"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="d-flex gap-2 justify-content-end mt-2">
        <Button
          variant="link"
          className="p-0 text-primary"
          onClick={() => handleEdit(order)}
        >
          <FaPen size={16} />
        </Button>
        <Button
          variant="link"
          className="p-0 text-success"
          onClick={() => handleGenerate(order._id)}
        >
          <FaFileDownload size={16} />
        </Button>
      </div>
    </div>
  );

  return (
    <Container fluid className="orders-container p-2 p-md-4">
      <Row>
        <Col>
          <Header category="Page" title="Orders" />

          {updateSuccess && (
            <div className="alert alert-success" role="alert">
              Status updated successfully!
            </div>
          )}

          <Card className="mb-4">
            <Card.Body className="p-2 p-md-4">
              {/* Filter Buttons Section */}
              <div className="filter-section mb-4">
                <ButtonGroup className="d-flex flex-wrap gap-2">
                  <Button 
                    variant="primary" 
                    className="flex-grow-1 mb-2 mb-md-0"
                    onClick={() => applyFilter("today")}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-grow-1 mb-2 mb-md-0"
                    onClick={() => applyFilter("thisWeek")}
                  >
                    This Week
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-grow-1 mb-2 mb-md-0"
                    onClick={() => applyFilter("thisMonth")}
                  >
                    This Month
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-grow-1 mb-2 mb-md-0"
                    onClick={() => applyFilter("all")}
                  >
                    All
                  </Button>
                </ButtonGroup>
              </div>

              <h5 className="mb-3">Orders List</h5>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {/* Mobile View */}
                  <div className="d-block d-md-none">
                    {filteredOrders.map((order) => renderMobileCard(order))}
                  </div>

                  {/* Desktop View */}
                  <div className="d-none d-md-block table-responsive">
                    <Table striped bordered hover className="orders-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th className="d-none d-md-table-cell">Email</th>
                          <th>Phone</th>
                          <th className="d-none d-md-table-cell">Service</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th className="d-none d-md-table-cell">Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order._id}>
                            {editingOrder && editingOrder._id === order._id ? (
                              // Edit mode
                              <>
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={editingOrder.name}
                                    onChange={(e) => handleEditChange('name', e.target.value)}
                                  />
                                </td>
                                <td className="d-none d-md-table-cell">
                                  <Form.Control
                                    type="email"
                                    value={editingOrder.email}
                                    onChange={(e) => handleEditChange('email', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={editingOrder.phone}
                                    onChange={(e) => handleEditChange('phone', e.target.value)}
                                  />
                                </td>
                                <td className="d-none d-md-table-cell">
                                  <Form.Control
                                    type="text"
                                    value={editingOrder.service}
                                    onChange={(e) => handleEditChange('service', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    value={editingOrder.amount}
                                    onChange={(e) => handleEditChange('amount', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <Form.Select
                                    value={editingOrder.status}
                                    onChange={(e) => handleEditChange(e.target.value)}
                                    className="status-select"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </Form.Select>
                                </td>
                                <td className="d-none d-md-table-cell">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={handleEditSubmit}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => setEditingOrder(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              // View mode
                              <>
                                <td>{order.customerName}</td>
                                <td className="d-none d-md-table-cell">{order.customerEmail}</td>
                                <td>{order.phone}</td>
                                <td className="d-none d-md-table-cell">{order.serviceSelected}</td>
                                <td>₹{order.amountPaid}</td>
                                <td>
                                  <span className={`order-status-badge ${order.orderStatus?.toLowerCase().replace(' ', '-')}`}>
                                    {order.orderStatus}
                                  </span>
                                </td>
                                <td className="d-none d-md-table-cell">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                      variant="link"
                                      className="p-0 text-primary"
                                      onClick={() => handleEdit(order)}
                                    >
                                      <FaPen size={16} />
                                    </Button>
                                    <Button
                                      variant="link"
                                      className="p-0 text-success"
                                      onClick={() => handleGenerate(order._id)}
                                    >
                                      <FaFileDownload size={16} />
                                    </Button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          {/* Create Order Form */}
          <Card className="mb-4">
            <Card.Body>
              <h5>Create New Order</h5>
              <Form onSubmit={handleCreateOrder}>
                <Form.Group controlId="customerName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="customerEmail">
                  <Form.Label>Customer Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newOrder.customerEmail}
                    onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.city}
                    onChange={(e) => setNewOrder({ ...newOrder, city: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.phone}
                    onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="serviceSelected">
                  <Form.Label>Service Selected</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.serviceSelected}
                    onChange={(e) => setNewOrder({ ...newOrder, serviceSelected: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="packageSelected">
                  <Form.Label>Package Selected</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.packageSelected}
                    onChange={(e) => setNewOrder({ ...newOrder, packageSelected: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="amountPaid">
                  <Form.Label>Amount Paid</Form.Label>
                  <Form.Control
                    type="number"
                    value={newOrder.amountPaid}
                    onChange={(e) => setNewOrder({ ...newOrder, amountPaid: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="totalAmount">
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={newOrder.totalAmount}
                    onChange={(e) => setNewOrder({ ...newOrder, totalAmount: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newOrder.message}
                    onChange={(e) => setNewOrder({ ...newOrder, message: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="orderStatus">
                  <Form.Label>Order Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={newOrder.orderStatus}
                    onChange={(e) => setNewOrder({ ...newOrder, orderStatus: e.target.value })}
                  >
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>In Progress</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="custom">
                  <Form.Label>Custom Field</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.custom}
                    onChange={(e) => setNewOrder({ ...newOrder, custom: e.target.value })}
                  />
                </Form.Group>
                <Button type="submit">Create Order</Button>
              </Form>
            </Card.Body>
          </Card>

          {showTab.details && selectedOrder && (
            <Card className="mb-4">
              <Card.Body>
                <h4>Order Details</h4>
                <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
                <Button variant="primary" onClick={() => setShowTab({ details: false })}>Close</Button>
              </Card.Body>
            </Card>
          )}

          {showTab.edit && selectedOrder && (
            <Card className="mb-4">
              <Card.Body>
                <h4>Edit Order</h4>
                <Form onSubmit={handleEditSubmit}>
                <Form.Group controlId="orderStatus">
                     <Form.Label>Status</Form.Label>
                     <Form.Control
                       as="select"
                      value={selectedOrder?.orderStatus || ""}
                       onChange={(e) =>
                       setSelectedOrder({
                        ...selectedOrder,
                        orderStatus: e.target.value,
                     })
    }
  >
                     <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                     <option value="Completed">Completed</option>
                     </Form.Control>
                     </Form.Group>

                  <Form.Group controlId="paymentDone">
                    <Form.Label>Payment Done</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedOrder.paymentDone}
                      onChange={(e) =>
                        setSelectedOrder({ ...selectedOrder, paymentDone: e.target.value })
                      }
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="primary">Update</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowTab({ edit: false })}
                    className="ml-3"
                  >
                    Close
                  </Button>
                </Form>
                {updateSuccess && <p>Update successful!</p>}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;
