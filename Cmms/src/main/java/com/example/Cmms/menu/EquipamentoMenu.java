package com.example.Cmms.menu;

import com.example.Cmms.model.Ativo;
import com.example.Cmms.service.AtivoService;

import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class EquipamentoMenu {

    private static final AtivoService ativoService = new AtivoService();

    public static void menu(Scanner scanner) {
        boolean continuar = true;
        while (continuar) {
            System.out.println("\n=== EQUIPAMENTOS (ATIVOS) ===");
            System.out.println("1 - Cadastrar");
            System.out.println("2 - Listar Todos");
            System.out.println("3 - Buscar por ID");
            System.out.println("4 - Buscar por Setor");
            System.out.println("5 - Buscar por Criticidade");
            System.out.println("6 - Atualizar");
            System.out.println("7 - Excluir (desativar)");
            System.out.println("8 - Relatório por Criticidade");
            System.out.println("0 - Voltar");
            System.out.print("Opção: ");

            try {
                int op = Integer.parseInt(scanner.nextLine().trim());
                switch (op) {
                    case 1 -> cadastrar(scanner);
                    case 2 -> listar();
                    case 3 -> buscarPorId(scanner);
                    case 4 -> buscarPorSetor(scanner);
                    case 5 -> buscarPorCriticidade(scanner);
                    case 6 -> atualizar(scanner);
                    case 7 -> excluir(scanner);
                    case 8 -> relatorio();
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
        System.out.print("Nome: ");                               String nome       = s.nextLine();
        System.out.print("Código (ex: COMP-001): ");             String codigo     = s.nextLine();
        System.out.print("Criticidade (BAIXA/MEDIA/ALTA/CRITICA): "); String crit  = s.nextLine();
        System.out.print("Setor: ");                             String setor      = s.nextLine();
        Ativo a = ativoService.cadastrar(nome, codigo, crit, setor);
        System.out.println("Ativo cadastrado! ID=" + a.getId());
    }

    private static void listar() throws Exception {
        List<Ativo> lista = ativoService.listarTodos();
        if (lista.isEmpty()) { System.out.println("Nenhum ativo encontrado."); return; }
        System.out.printf("%n%-5s %-30s %-15s %-10s %-15s %-10s%n",
                "ID", "Nome", "Codigo", "Criticidade", "Setor", "Status");
        System.out.println("-".repeat(90));
        for (Ativo a : lista) {
            System.out.printf("%-5d %-30s %-15s %-10s %-15s %-10s%n",
                    a.getId(), a.getNome(), a.getCodigo(), a.getCriticidade(), a.getSetor(), a.getStatus());
        }
    }

    private static void buscarPorId(Scanner s) throws Exception {
        System.out.print("ID: ");
        Long id = Long.parseLong(s.nextLine().trim());
        ativoService.buscarPorId(id).ifPresentOrElse(
                a -> System.out.println(a),
                () -> System.out.println("Ativo não encontrado.")
        );
    }

    private static void buscarPorSetor(Scanner s) throws Exception {
        System.out.print("Setor: ");
        List<Ativo> lista = ativoService.listarPorSetor(s.nextLine());
        if (lista.isEmpty()) { System.out.println("Nenhum resultado."); return; }
        lista.forEach(System.out::println);
    }

    private static void buscarPorCriticidade(Scanner s) throws Exception {
        System.out.print("Criticidade (BAIXA/MEDIA/ALTA/CRITICA): ");
        List<Ativo> lista = ativoService.listarPorCriticidade(s.nextLine().toUpperCase());
        if (lista.isEmpty()) { System.out.println("Nenhum resultado."); return; }
        lista.forEach(System.out::println);
    }

    private static void atualizar(Scanner s) throws Exception {
        System.out.print("ID do ativo: ");       Long id   = Long.parseLong(s.nextLine().trim());
        System.out.print("Novo nome: ");          String nome  = s.nextLine();
        System.out.print("Nova criticidade: ");   String crit  = s.nextLine();
        System.out.print("Novo setor: ");         String setor = s.nextLine();
        System.out.print("Status (ATIVO/INATIVO/QUEBRADO/MANUTENCAO): "); String status = s.nextLine();
        ativoService.atualizar(id, nome, crit, setor, status);
        System.out.println("Ativo atualizado!");
    }

    private static void excluir(Scanner s) throws Exception {
        System.out.print("ID do ativo a excluir: ");
        Long id = Long.parseLong(s.nextLine().trim());
        ativoService.excluir(id);
        System.out.println("Ativo desativado.");
    }

    private static void relatorio() throws Exception {
        Map<String, Long> rel = ativoService.relatorioAtivosporCriticidade();
        System.out.println("\n--- Ativos por Criticidade ---");
        rel.forEach((crit, total) -> System.out.printf("  %-10s: %d ativo(s)%n", crit, total));
    }
}
