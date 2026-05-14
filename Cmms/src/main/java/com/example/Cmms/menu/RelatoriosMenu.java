package com.example.Cmms.menu;

import com.example.Cmms.model.OrdemServico;
import com.example.Cmms.service.AtivoService;
import com.example.Cmms.service.OSService;

import java.util.List;
import java.util.Map;
import java.util.Scanner;

/**
 * Submenu de relatórios.
 * Não contém SQL — delega ao OSService e AtivoService.
 */
public class RelatoriosMenu {

    private static final OSService    osService    = new OSService();
    private static final AtivoService ativoService = new AtivoService();

    public static void menu(Scanner scanner) {
        boolean continuar = true;
        while (continuar) {
            System.out.println("\n=== RELATÓRIOS ===");
            System.out.println("1 - Top N OS por Prioridade");
            System.out.println("2 - Setores com OS Abertas");
            System.out.println("3 - OS Abertas por Responsável (Técnico)");
            System.out.println("4 - Ativos por Criticidade");
            System.out.println("5 - OS Abertas em um Setor");
            System.out.println("0 - Voltar");
            System.out.print("Opção: ");

            try {
                int op = Integer.parseInt(scanner.nextLine().trim());
                switch (op) {
                    case 1 -> topNPorPrioridade(scanner);
                    case 2 -> setoresComOSAbertas();
                    case 3 -> osPorResponsavel();
                    case 4 -> ativosPorCriticidade();
                    case 5 -> osPorSetor(scanner);
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

    private static void topNPorPrioridade(Scanner s) throws Exception {
        System.out.print("Quantas OS exibir (N): ");
        int n = Integer.parseInt(s.nextLine().trim());
        List<OrdemServico> lista = osService.topNPorPrioridade(n);
        if (lista.isEmpty()) { System.out.println("Nenhuma OS aberta."); return; }
        System.out.println("\n--- Top " + n + " OS por Prioridade ---");
        System.out.printf("%-5s %-12s %-10s %-15s %-10s%n", "ID", "Tipo", "Status", "Setor", "Prioridade");
        System.out.println("-".repeat(55));
        for (OrdemServico os : lista) {
            System.out.printf("%-5d %-12s %-10s %-15s %-10d%n",
                    os.getId(), os.getTipo(), os.getStatus(), os.getSetor(), os.calcularPrioridade());
        }
    }

    private static void setoresComOSAbertas() throws Exception {
        List<String> setores = osService.setoresComOSAbertas();
        System.out.println("\n--- Setores com OS Abertas ---");
        if (setores.isEmpty()) { System.out.println("Nenhum setor com OS abertas."); return; }
        setores.forEach(setor -> System.out.println("  * " + setor));
    }

    private static void osPorResponsavel() throws Exception {
        Map<String, Long> rel = osService.relatorioPorResponsavel();
        System.out.println("\n--- OS Abertas por Responsável ---");
        if (rel.isEmpty()) { System.out.println("Nenhuma OS aberta."); return; }
        System.out.printf("%-30s %s%n", "Técnico", "OS Abertas");
        System.out.println("-".repeat(42));
        rel.forEach((nome, total) -> System.out.printf("%-30s %d%n", nome, total));
    }

    private static void ativosPorCriticidade() throws Exception {
        Map<String, Long> rel = ativoService.relatorioAtivosporCriticidade();
        System.out.println("\n--- Ativos por Criticidade ---");
        if (rel.isEmpty()) { System.out.println("Nenhum ativo encontrado."); return; }
        rel.forEach((crit, total) -> System.out.printf("  %-10s: %d ativo(s)%n", crit, total));
    }

    private static void osPorSetor(Scanner s) throws Exception {
        System.out.print("Setor: ");
        String setor = s.nextLine();
        List<OrdemServico> lista = osService.listarPorSetor(setor);
        System.out.println("\n--- OS no Setor: " + setor + " ---");
        if (lista.isEmpty()) { System.out.println("Nenhuma OS aberta neste setor."); return; }
        System.out.printf("%-5s %-12s %-10s %-10s%n", "ID", "Tipo", "Status", "Prioridade");
        System.out.println("-".repeat(42));
        for (OrdemServico os : lista) {
            System.out.printf("%-5d %-12s %-10s %-10d%n",
                    os.getId(), os.getTipo(), os.getStatus(), os.calcularPrioridade());
        }
    }
}
