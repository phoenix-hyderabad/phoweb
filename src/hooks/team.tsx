import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMember } from "~/server/actions/team";

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ["team"] });
      toast.success("Deleted member successfully");
    },
    onError: () => {
      toast.error("Error deleting member");
    },
  });
  return deleteMutation;
};
