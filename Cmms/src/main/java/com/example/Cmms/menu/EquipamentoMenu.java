package com.example.Cmms.menu;


import com.example.Cmms.api.ApiClient;

import java.util.Scanner;

public class EquipamentoMenu {

    public static void menu(Scanner scanner) {
        while (true) {
            System.out.println("\n=== EQUIPAMENTOS ===");
            System.out.println("1 - Criar");
            System.out.println("2 - Listar");
            System.out.println("3 - Buscar por ID");
            System.out.println("4 - Buscar por Setor");
            System.out.println("5 - Buscar por Criticidade");
            System.out.println("6 - Excluir");
            System.out.println("0 - Voltar");

            int op = Integer.parseInt(scanner.nextLine());

            try {
                switch (op) {
                    case 1 -> criar(scanner);
                    case 2 -> System.out.println(
                            ApiClient.get("/equipamento?page=0&size=10&sort=nome,asc"));
                    case 3 -> buscarPorId(scanner);
                    case 4 -> buscarPorSetor(scanner);
                    case 5 -> buscarPorCriticidade(scanner);
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

        System.out.print("Código: ");
        String codigo = s.nextLine();

        System.out.print("Status: ");
        String status = s.nextLine();

        System.out.print("Criticidade: ");
        String criticidade = s.nextLine();

        System.out.print("Setor: ");
        String setor = s.nextLine();

        String json = """
        {
          "nome":"%s",
          "codigo":"%s",
          "status":"%s",
          "criticidade":"%s",
          "setor":"%s"
        }
        """.formatted(nome, codigo, status, criticidade, setor);

        System.out.println(ApiClient.post("/equipamento", json));
    }

    private static void buscarPorId(Scanner s) throws Exception {
        System.out.print("ID: ");
        String id = s.nextLine();
        System.out.println(ApiClient.get("/equipamento/" + id));
    }

    private static void buscarPorSetor(Scanner s) throws Exception {
        System.out.print("Setor: ");
        String setor = s.nextLine();
        System.out.println(ApiClient.get("/equipamento/setor/" + setor));
    }

    private static void buscarPorCriticidade(Scanner s) throws Exception {
        System.out.print("Criticidade: ");
        String crit = s.nextLine();
        System.out.println(ApiClient.get(
                "/equipamento/criticidade/" + crit + "?page=0&size=10"));
    }

    private static void excluir(Scanner s) throws Exception {
        System.out.print("ID: ");
        String id = s.nextLine();
        System.out.println(ApiClient.delete("/equipamento/" + id));
    }
}