import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { customersData, customersGrid } from '../Data/dummy';
import { Header } from '../Components';

const Customers = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Design Leads" />

      <p className="text-gray-600 text-lg mb-6">
      </p>

      <GridComponent
        dataSource={customersData}
        allowPaging
        allowSorting
        toolbar={['Delete', 'Search']}
        editSettings={{ allowDeleting: true, allowEditing: true }}
        width='auto'
      >
        <ColumnsDirective>
          {customersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
      </GridComponent>
      
      <div className="mt-6">
        <p className="text-gray-600 text-md">To better manage customers, you can:</p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>View customer details and the design services they have availed.</li>
          <li>Edit customer information such as contact details and preferences.</li>
          <li>Delete customers who no longer require services or have completed their orders.</li>
          <li>Filter customers based on their preferred design services or order status.</li>
        </ul>
      </div>
    </div>
  );
};

export default Customers;
