"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { withAuth } from "@/components/withAuth";
import { fetchAllCollaborations } from "@/lib/features/collaborationSlice";

function Collaboration() {
  const dispatch = useDispatch();
  const collaborations = useSelector(
    (state) => state.collaboration.collaborations.data
  );

  const collaborationsStatus = useSelector(
    (state) => state.collaboration.collaborationsStatus
  );

  useEffect(() => {
    dispatch(fetchAllCollaborations());
  }, []);
  return (
    <>
      {collaborationsStatus === "loading" ? (
        <p>Loading</p>
      ) : collaborationsStatus === "failed" ? (
        <p>Error</p>
      ) : collaborationsStatus === "succeeded" ? (
        <DataTable
          columns={columns}
          data={collaborations}
          searchFunction={false}
        />
      ) : null}
    </>
  );
}

export default Collaboration;
