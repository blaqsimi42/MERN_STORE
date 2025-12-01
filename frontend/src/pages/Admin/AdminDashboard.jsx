import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import AllOrders from "./AllOrders";
import Loader from "../../components/Loader";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { formatCurrency } from "../../Utils/formatCurrency.js"

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingUsers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail, isLoading: loadingChart } =
    useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          background: "#000",
        },
        zoom: { enabled: false },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val) => formatCurrency(val), // ✅ Tooltip ₦1,000.00
        },
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
        style: { colors: ["#fff"], fontWeight: "bold" },
        formatter: (val) => formatCurrency(val), // ✅ Bar labels ₦1,000.00
      },
      stroke: { curve: "smooth", width: 3 },
      title: {
        text: "Sales Trend (Recent Days)",
        align: "left",
        style: { color: "#fff", fontSize: "16px" },
      },
      grid: { borderColor: "#333" },
      markers: { size: 3 },
      xaxis: {
        categories: [],
        title: { text: "Date", style: { color: "#fff" } },
        labels: { style: { colors: "#fff" } },
      },
      yaxis: {
        title: { text: "Sales (₦)", style: { color: "#fff" } },
        labels: {
          style: { colors: "#fff" },
          formatter: (value) => formatCurrency(value), // ✅ Axis ₦1,000.00
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: { colors: "#fff" },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (Array.isArray(salesDetail) && salesDetail.length > 0) {
      const validData = salesDetail.filter(
        (item) => item && item._id && item.totalSales !== undefined
      );

      const categories = validData.map((item) => item._id);
      const values = validData.map((item) =>
        parseFloat(Number(item.totalSales).toFixed(2))
      );

      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: { ...prev.options.xaxis, categories },
        },
        series: [{ name: "Sales", data: values }],
      }));
    }
  }, [salesDetail]);

  const isLoading =
    loadingSales || loadingUsers || loadingOrders || loadingChart;

  if (isLoading) return <Loader />;

  return (
    <>


      <section className="xl:ml-16 md:ml-0 ml-4 text-white">
        
        <div className="w-[80%] grid ml-8 md:ml-12 lg:ml-20 justify-center lg:grid-cols-3 gap-16">
          {/* Total Sales */}
          
          <div className="rounded-lg bg-[#111] p-5 w-[20rem] mt-5 shadow-md">
            <div className="font-bold text-center p-4">
              <p className="text-[2rem] w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                ₦
              </p>
            </div>
            <p className="mt-5 text-white">Total Sales</p>
            <h1 className="text-xl font-bold">
              {formatCurrency(sales?.totalSales || 0)}
            </h1>
          </div>

          {/* Customers */}
          <div className="rounded-lg bg-[#111] p-5 w-[20rem] mt-5 shadow-md">
            <div className="font-bold rounded-full text-center p-3 w-12 h-12 bg-pink-500 ml-4 flex items-center justify-center">
              <FaUser size={22} />
            </div>
            <p className="mt-8 text-white">Customers</p>
            <h1 className="text-xl font-bold">{customers?.length || 0}</h1>
          </div>

          {/* Orders */}
          <div className="rounded-lg bg-[#111] p-5 w-[20rem] mt-5 shadow-md">
            <div className="font-bold rounded-full w-12 h-12 bg-pink-500 text-center mt-4 p-2.5 ml-4 flex items-center justify-center">
              <FaShoppingCart size={22} />
            </div>
            <p className="mt-8 text-white">All Orders</p>
            <h1 className="text-xl font-bold">{orders?.totalOrders || 0}</h1>
          </div>
        </div>

        {/* ===== Chart ===== */}
        <div className="ml-8 md:ml-32 mt-20">
          {state.series[0].data.length > 0 ? (
           
              <Chart
                options={state.options}
                series={state.series}
                type="bar"
                width="80%"
                height="400"
              />
          ) : (
            <p className="text-white md:ml-10 ml-5">No sales data available yet</p>
          )}
        </div>

        {/* ===== Orders ===== */}
        <div className="mt-20 md:mr-28 mr-4">
          <AllOrders />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
