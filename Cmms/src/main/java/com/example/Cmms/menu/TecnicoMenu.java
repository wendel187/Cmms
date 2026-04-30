package com.example.Cmms.menu;


import com.example.Cmms.api.ApiClient;

import java.util.Scanner;

public class TecnicoMenu {

    public static void menu(Scanner scanner) {
        while (true) {
            System.out.println("\n=== TÉCNICOS ===");
            System.out.println("1 - Criar");
            System.out.println("2 - Listar");
            System.out.println("3 - Buscar por ID");
            System.out.println("4 - Buscar por Status");
            System.out.println("5 - Buscar por Setor");
            System.out.println("6 - Desativar");
            System.out.println("0 - Voltar");

            int op = Integer.parseInt(scanner.nextLine());

            try {
                switch (op) {
                    case 1 -> criar(scanner);
                    case 2 -> System.out.println(ApiClient.get("/tecnico?page=0&size=10"));
                    case 3 -> buscarPorId(scanner);
                    case 4 -> buscarPorStatus(scanner);
                    case 5 -> buscarPorSetor(scanner);
                    case 6 -> excluir(scanner);
                    case 0 -> { return; }
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    private static void criar(Scanner s) throws Exception {
        System.out.print("Nome: ");
        String nome = s.nextLine();

        System.out.print("Email: ");
        String email = s.nextLine();

        System.out.print("Telefone: ");
        String telefone = s.nextLine();

        System.out.print("Especialidade: ");
        String esp = s.nextLine();

        System.out.print("Setor: ");
        String setor = s.nextLine();

        String json = """
        {
          "nome":"%s",
          "email":"%s",
          "telefone":"%s",
          "especialidade":"%s",
          "setor":"%s",
          "status":"DISPONIVEL"
        }
        """.formatted(nome, email, telefone, esp, setor);

        System.out.println(ApiClient.post("/tecnico", json));
    }

    private static void buscarPorId(Scanner s) throws Exception {
        System.out.print("ID: ");
        System.out.println(ApiClient.get("/tecnico/" + s.nextLine()));
    }

    private static void buscarPorStatus(Scanner s) throws Exception {
        System.out.print("Status: ");
        String status = s.nextLine();
        System.out.println(ApiClient.get("/tecnico/status/" + status + "?page=0&size=10"));
    }

    private static void buscarPorSetor(Scanner s) throws Exception {
        System.out.print("Setor: ");
        System.out.println(ApiClient.get("/tecnico/setor/" + s.nextLine()));
    }

    private static void excluir(Scanner s) throws Exception {
        System.out.print("ID: ");
        System.out.println(ApiClient.delete("/tecnico/" + s.nextLine()));
    }
}