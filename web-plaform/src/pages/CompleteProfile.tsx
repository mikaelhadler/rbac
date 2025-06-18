import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  buildingName: z.string().min(2, "Nome do condomínio é obrigatório"),
  address: z.string().min(5, "Endereço é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().length(8, "CEP deve ter 8 dígitos"),
});

type FormData = z.infer<typeof formSchema>;

export function CompleteProfile() {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      // TODO: Implement profile completion logic
      console.log(data);
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Você será redirecionado para o dashboard.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete seu Perfil</CardTitle>
          <CardDescription>
            Adicione as informações do seu condomínio para começar a gerenciar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buildingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Condomínio</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do seu condomínio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000" maxLength={8} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Completar Perfil
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}