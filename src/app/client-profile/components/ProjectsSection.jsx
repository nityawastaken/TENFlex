import React, { useEffect, useState } from "react";
import Section from "./Section";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProjectCard from "./ProjectCard";
import Link from "next/link";

const ProjectsSection = ({ refProp, projects, setProjects, id }) => {
  const [projectStatus, setProjectStatus] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const token = localStorage.getItem("token");
  const router = useRouter();

  const fetchProjects = async () => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/base/projects/",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    setProjects(response.data);
  };


  useEffect(() => {
    if (!token) {
      router.push("/signin");
    }
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (projectStatus === "open") {
      filtered = projects.filter((project) => project.is_open === true);
    } else if (projectStatus === "closed") {
      filtered = projects.filter((project) => project.is_open === false);
    }
    // Filter by project.client === id
    if (id) {
      filtered = filtered.filter((project) => project.client === +id);

    }

    setFilteredProjects(filtered);
  }, [projectStatus, projects]);

  

  return (
    <div className="hover:scale-105 duration-300"> 
    <Section ref={refProp} id="projects" title="Your Projects" className="">
      <div className="">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4 ">
          <select
            name="project-status"
            onChange={(e) => setProjectStatus(e.target.value)}
            className="px-4 py-2 border border-purple-700 rounded-lg h-full cursor-pointer bg-[#24194a] text-white w-full md:w-auto focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide w-full">
          <div className="flex flex-row gap-6 justify-start min-w-full">
            {filteredProjects.length === 0 ? (
              <div className="text-gray-400 text-lg py-8 w-full text-center">
                No projects found for selected status.
              </div>
            ) : (
              filteredProjects.map((p) => <ProjectCard key={p.id} p={p} />)
            )}
          </div>
        </div>
        {projects.length !== 0 && (
          <div className="mt-3 w-full justify-center text-center flex">
            <p className="mx-auto text-gray-400 text-xs font-light leading-tight">
              ← Scroll horizontally to view other orders →
            </p>
          </div>
        )}
      </div>
    </Section>
    </div>
  );
};

export default ProjectsSection;
