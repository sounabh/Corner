import { useState, useEffect } from 'react';
import axios from 'axios';
import { Code2, Users, GitBranch, FolderPlus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuthStore from '../../store/authStore';
import { NavLink } from 'react-router-dom';

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (!token) return; // Prevent API call if token is missing

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_BASE_URL}/editor/projects`, {
          headers: { authorization: `Bearer ${token}` }
        });
        setProjects(response?.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-gray-300 flex items-center justify-center">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-gray-300 flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-gray-300">
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-blue-400">Projects</h2>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2">
            <GitBranch className="h-4 w-4" /> New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[#252526] rounded-lg p-12 border border-[#333]">
            <FolderPlus className="h-16 w-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 text-center mb-6">
              Get started by creating your first project
            </p>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2">
              <GitBranch className="h-4 w-4" /> Create New Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project?._id} className="bg-[#252526] border border-[#333] hover:border-blue-400 transition-all">
                <CardHeader className="p-0 relative">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 z-10 h-8 bg-[#1E1E1E]/80 backdrop-blur-sm px-4 flex items-center justify-between text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        {project?.code || "No Code"}
                      </div>
                    </div>
                    <img 
                      src={project?.image || "/api/placeholder/400/320"} 
                      alt={project?.name || "Project Image"} 
                      className="object-cover transition-transform hover:scale-105 w-full h-full"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-200 hover:text-blue-400 transition-colors">
                    {project?.name || "Untitled Project"}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-300 mt-2">
                    <Users className="h-4 w-4" />
                    <p className="text-sm">{project.participants?.length || 0} Participants</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Created on {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Unknown Date"}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <NavLink to={`/editor/${project.code}`} className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                      <Code2 className="mr-2 h-4 w-4" /> View Code
                    </Button>
                  </NavLink>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectsSection;
