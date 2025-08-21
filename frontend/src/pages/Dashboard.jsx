import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [borrower, setBorrower] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editId, setEditId] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Fetch all loans
  const fetchLoans = () => {
    axios
      .get(`${BACKEND_URL}/loans`)
      .then((res) => setLoans(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Add or update loan
  const handleSubmit = (e) => {
    e.preventDefault();
    const loanData = { borrower, amount, status };

    if (editId) {
      axios
        .put(`${BACKEND_URL}/loans/${editId}`, loanData)
        .then(() => {
          fetchLoans();
          resetForm();
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post(`${BACKEND_URL}/loans`, loanData)
        .then(() => {
          fetchLoans();
          resetForm();
        })
        .catch((err) => console.log(err));
    }
  };

  // Edit loan
  const handleEdit = (loan) => {
    setBorrower(loan.borrower);
    setAmount(loan.amount);
    setStatus(loan.status);
    setEditId(loan._id);
  };

  // Delete loan
  const handleDelete = (id) => {
    if (!window.confirm("Delete this loan?")) return;
    axios
      .delete(`${BACKEND_URL}/loans/${id}`)
      .then(() => fetchLoans())
      .catch((err) => console.log(err));
  };

  const resetForm = () => {
    setBorrower("");
    setAmount("");
    setStatus("Pending");
    setEditId(null);
  };

  // Logout
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-700">Loan Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 flex flex-wrap gap-4 items-end bg-white p-6 rounded-xl shadow-md"
      >
        <input
          type="text"
          placeholder="Borrower Name"
          value={borrower}
          onChange={(e) => setBorrower(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-4 py-3 rounded-lg shadow-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition font-semibold"
        >
          {editId ? "Update Loan" : "Add Loan"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Loans Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700 font-bold uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-6 py-3 text-left text-gray-700 font-bold uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-gray-700 font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-gray-700 font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">{loan.borrower}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${loan.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-white ${
                        loan.status === "Approved"
                          ? "bg-green-500"
                          : loan.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                    <button
                      onClick={() => handleEdit(loan)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(loan._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No loans available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
