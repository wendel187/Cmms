package com.example.Cmms.menu;


import com.example.Cmms.api.ApiClient;

import java.util.Scanner;

public class OrdemServicoMenu {

    public static void menu(Scanner scanner) {
        while (true) {
            System.out.println("\n=== ORDENS DE SERVIÇO ===");
            System.out.println("1 - Criar Corretiva");
            System.out.println("2 - Criar Preventiva");
            System.out.println("3 - Listar Todas");
            System.out.println("4 - Buscar por ID");
            System.out.println("5 - Ordens Abertas");
            System.out.println("6 - Atualizar Status");
            System.out.println("7 - Histórico");
            System.out.println("8 - Cancelar");
            System.out.println("0 - Voltar");

            int op = Integer.parseInt(scanner.nextLine());

            try {
                switch (op) {
                    case 1 -> criarCorretiva(scanner);
                    case 2 -> criarPreventiva(scanner);
                    case 3 -> System.out.println(ApiClient.get("/ordens-servico?page=0&size=10"));
                    case 4 -> buscarPorId(scanner);
                    case 5 -> System.out.println(ApiClient.get("/ordens-servico/abertas"));
                    case 6 -> atualizarStatus(scanner);
                    case 7 -> historico(scanner);
                    case 8 -> cancelar(scanner);
                    case 0 -> { return; }
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    private static void criarCorretiva(Scanner s) throws Exception {
        String json = """
        {
          "equipamentoId":1,
          "tecnicoId":1,
          "descricao":"Falha geral",
          "descricaoFalha":"Motor travado",
          "setor":"Produção",
          "falhaTotal":true,
          "nivelCriticidade":3
        }
        """;

        System.out.println(ApiClient.post("/ordens-servico/corretiva", json));
    }

    private static void criarPreventiva(Scanner s) throws Exception {
        String json = """
        {
          "equipamentoId":1,
          "tecnicoId":1,
          "descricao":"Preventiva",
          "setor":"Produção",
          "dataPrevista":"2026-05-20",
          "periodicidadeDias":30,
          "ultimaManutencao":"2026-04-20"
        }
        """;

        System.out.println(ApiClient.post("/ordens-servico/preventiva", json));
    }

    private static void buscarPorId(Scanner s) throws Exception {
        System.out.print("ID: ");
        System.out.println(ApiClient.get("/ordens-servico/" + s.nextLine()));
    }

    private static void atualizarStatus(Scanner s) throws Exception {
        System.out.print("ID: ");
        String id = s.nextLine();

        System.out.print("Novo status: ");
        String status = s.nextLine();

        String json = """
        {
          "id": %s,
          "novoStatus":"%s",
          "observacoes":"Atualizado via client"
        }
        """.formatted(id, status);

        System.out.println(ApiClient.put("/ordens-servico/status", json));
    }

    private static void historico(Scanner s) throws Exception {
        System.out.print("ID: ");
        System.out.println(ApiClient.get("/ordens-servico/" + s.nextLine() + "/historico"));
    }

    private static void cancelar(Scanner s) throws Exception {
        System.out.print("ID: ");
        System.out.println(ApiClient.delete("/ordens-servico/" + s.nextLine()));
    }
}