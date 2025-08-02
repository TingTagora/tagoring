import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const JobsPage = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    isActive: true
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/jobs`, {
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });
      
      if (response.ok) {
        const jobsData = await response.json();
        setJobs(jobsData);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const jobData = {
        ...formData,
        requirements: JSON.stringify(
          formData.requirements.split(',').map(req => req.trim()).filter(req => req)
        )
      };

      const url = editingJob 
        ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/jobs/${editingJob.id}`
        : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/jobs`;
      
      const response = await fetch(url, {
        method: editingJob ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        toast.success(`Job ${editingJob ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        setEditingJob(null);
        setFormData({ title: '', description: '', requirements: '', isActive: true });
        fetchJobs();
      } else {
        throw new Error(`Failed to ${editingJob ? 'update' : 'create'} job`);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(`Failed to ${editingJob ? 'update' : 'create'} job`);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: Array.isArray(job.requirements) 
        ? job.requirements.join(', ') 
        : (job.requirements ? JSON.parse(job.requirements).join(', ') : ''),
      isActive: job.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (response.ok) {
        toast.success('Job deleted successfully!');
        fetchJobs();
      } else {
        throw new Error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        },
        body: JSON.stringify({ ...job, isActive: !job.isActive })
      });

      if (response.ok) {
        toast.success(`Job ${!job.isActive ? 'activated' : 'deactivated'} successfully!`);
        fetchJobs();
      } else {
        throw new Error('Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Job Management</h1>
        <button
          onClick={() => {
            setEditingJob(null);
            setFormData({ title: '', description: '', requirements: '', isActive: true });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Job
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left p-4 text-white">Title</th>
                <th className="text-left p-4 text-white">Description</th>
                <th className="text-left p-4 text-white">Requirements</th>
                <th className="text-left p-4 text-white">Status</th>
                <th className="text-left p-4 text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No jobs found. Create your first job listing!
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-t border-slate-700">
                    <td className="p-4 text-white font-medium">{job.title}</td>
                    <td className="p-4 text-gray-300 max-w-xs truncate">{job.description}</td>
                    <td className="p-4 text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(job.requirements) 
                          ? job.requirements 
                          : JSON.parse(job.requirements || '[]')
                        ).slice(0, 3).map((req, index) => (
                          <span key={index} className="bg-slate-600 text-xs px-2 py-1 rounded">
                            {req}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          job.isActive 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {job.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the job responsibilities and requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Requirements (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, JavaScript, Node.js"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-gray-300">
                  Active (visible to job seekers)
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
