package com.example.Cmms.menu;

import com.example.Cmms.model.Tecnico;
import com.example.Cmms.service.TecnicoServiceCli;

import java.util.List;
import java.util.Scanner;

public class TecnicoMenu {

    private static final TecnicoServiceCli tecnicoService = new TecnicoServiceCli();

    public static void menu(Scanner scanner) {
        boolean continuar = true;
        while (continuar) {
            System.out.println("\n=== TÉCNICOS ===");
            System.out.println("1 - Cadastrar");
            System.out.println("2 - Listar Ativos");
            System.out.println("3 - Buscar por ID");
            System.out.println("4 - Buscar por Status");
            System.out.println("5 - Buscar por Setor");
            System.out.println("6 - Atualizar");
            System.out.println("7 - Desativar");
            System.out.println("0 - Voltar");
            System.out.print("Opção: ");

            try {
                int op = Integer.parseInt(scanner.nextLine().trim());
                switch (op) {
                    case 1 -> cadastrar(scanner);
                    case 2 -> listar();
                    case 3 -> buscarPorId(scanner);
                    case 4 -> buscarPorStatus(scanner);
                    case 5 -> buscarPorSetor(scanner);
                    case 6 -> atualizar(scanner);
                    case 7 -> desativar(scanner);
                    case 0 -> continuar = false;
                    default -> System.out.println("Opção inválida!");
                }
            } catch (NumberFormatException e) {
                System.out.println("Digite um número válido.");
            } catch (Exception e) {
                System.out.println("Erro: " + e.getMessage());
            }
        }
    }

    private static void cadastrar(Scanner s) throws Exception {
        System.out.print("Nome: ");          String nome  = s.nextLine();
        System.out.print("Email: ");         String email = s.nextLine();
        System.out.print("Telefone: ");      String tel   = s.nextLine();
        System.out.print("Especialidade: "); String esp   = s.nextLine();
        System.out.print("Setor: ");         String setor = s.nextLine();
        Tecnico t = tecnicoService.cadastrar(nome, email, tel, esp, setor);
        System.out.println("Técnico cadastrado! ID=" + t.getId());
    }

    private static void listar() throws Exception {
        List<Tecnico> lista = tecnicoService.listarAtivos();
        if (lista.isEmpty()) { System.out.println("Nenhum técnico ativo."); return; }
        System.out.printf("%n%-5s %-25s %-20s %-15s %-14s%n",
                "ID", "Nome", "Especialidade", "Setor", "Status");
        System.out.println("-".repeat(82));
        for (Tecnico t : lista) {
            System.out.printf("%-5d %-25s %-20s %-15s %-14s%n",
                    t.getId(), t.getNome(), t.getEspecialidade(), t.getSetor(), t.getStatus());
        }
    }

    private static void buscarPorId(Scanner s) throws Exception {
        System.out.print("ID: ");
        Long id = Long.parseLong(s.nextLine().trim());
        tecnicoService.buscarPorId(id).ifPresentOrElse(
                t -> System.out.println(t),
                () -> System.out.println("Técnico não encontrado.")
        );
    }

    private static void buscarPorStatus(Scanner s) throws Exception {
        System.out.print("Status (DISPONIVEL/EM_MANUTENCAO/AUSENTE/INDISPONIVEL): ");
        List<Tecnico> lista = tecnicoService.listarPorStatus(s.nextLine());
        if (lista.isEmpty()) { System.out.println("Nenhum resultado."); return; }
        lista.forEach(System.out::println);
    }

    private static void buscarPorSetor(Scanner s) throws Exception {
        System.out.print("Setor: ");
        List<Tecnico> lista = tecnicoService.listarPorSetor(s.nextLine());
        if (lista.isEmpty()) { System.out.println("Nenhum resultado."); return; }
        lista.forEach(System.out::println);
    }

    private static void atualizar(Scanner s) throws Exception {
        System.out.print("ID do técnico: ");  Long id   = Long.parseLong(s.nextLine().trim());
        System.out.print("Novo nome: ");       String nome  = s.nextLine();
        System.out.print("Novo telefone: ");   String tel   = s.nextLine();
        System.out.print("Nova especialidade: "); String esp = s.nextLine();
        System.out.print("Novo setor: ");      String setor = s.nextLine();
        System.out.print("Status (DISPONIVEL/EM_MANUTENCAO/AUSENTE/INDISPONIVEL): "); String status = s.nextLine();
        tecnicoService.atualizar(id, nome, tel, esp, setor, status);
        System.out.println("Técnico atualizado!");
    }

    private static void desativar(Scanner s) throws Exception {
        System.out.print("ID do técnico a desativar: ");
        Long id = Long.parseLong(s.nextLine().trim());
        tecnicoService.desativar(id);
        System.out.println("Técnico desativado.");
    }
}
