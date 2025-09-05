import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MdOutlineDelete, MdMoreVert } from "react-icons/md";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import apiClient from "@/api/apiClient";

const ActionDropdown = ({ row }) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  // 🔹 Supprimer transaction
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(
        `${import.meta.env.VITE_BACKEND_URL}/user/transaction/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["transactions"], (oldData = []) =>
        oldData.filter((tr) => tr.id !== id)
      );
      toast.success("Transaction supprimée avec succès");
      setOpen(false);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Impossible de supprimer la transaction"
      );
      console.error(err);
      setOpen(false);
    },
  });

  const handleDelete = () => deleteMutation.mutate(row.id);

  return (
    <>
      {/* Menu déroulant */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <span className="sr-only">Open menu</span>
            <MdMoreVert className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center gap-2 p-2"
            onClick={() => console.log("Voir détails", row)}
          >
            <Eye className="w-4 h-4" />
            <span>Détails</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 p-2 text-red-600"
            onClick={() => setOpen(true)}
          >
            <MdOutlineDelete className="w-4 h-4" />
            <span>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation suppression */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression ?</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cette transaction ? Cette action
              est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionDropdown;
