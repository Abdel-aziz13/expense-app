import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MdOutlineDelete, MdMoreVert } from "react-icons/md";
import { Eye } from "lucide-react";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ActionDropdown = ({ row }) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token"); // Récupérer le token directement ici

  // 🔹 Mutation pour supprimer la transaction
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/user/transaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      Swal.fire("Supprimé !", "La transaction a été supprimée.", "success");
    },
    onError: (err) => {
      Swal.fire(
        "Erreur",
        err.response?.data?.message ||
          "Impossible de supprimer la transaction.",
        "error"
      );
      console.error(err);
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Confirmer la suppression ?",
      text: `Voulez-vous vraiment supprimer cette transaction ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(row.id);
      }
    });
  };

  const menuItems = [
    {
      icon: <Eye />,
      label: "Détails",
      onClick: () => console.log("Voir détails", row),
    },
    {
      icon: <MdOutlineDelete className="text-lg" />,
      label: "Supprimer",
      className: "text-red-600",
      onClick: handleDelete,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MdMoreVert className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className={`flex items-center gap-2 p-[10px] ${
              item.className || ""
            }`}
            onClick={item.onClick}
          >
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;
