package com.example.Cmms.menu;

import com.example.Cmms.model.HistoricoStatus;
import com.example.Cmms.model.OrdemServico;
import com.example.Cmms.service.OSService;

import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

public class OrdemServicoMenu {

    private static final OSService osService = new OSService();

    public static void menu(Scanner scanner) {
        boolean continuar = true;
        while (continuar) {
            System.out.println("\n=== ORDENS DE SERVIÇO ===");
            System.out.println("1  - Criar OS Corretiva");
            System.out.println("2  - Criar OS Preventiva");
            System.out.println("3  - Listar Todas");
            System.out.println("4  - Buscar por ID");
            System.out.println("5  - Listar Abertas (por prioridade)");
            System.out.println("6  - Atualizar Status");
            System.out.println("7  - Histórico de Status");
            System.out.println("8  - Cancelar OS");
            System.out.println("9  - OS por Equipamento");
            System.out.println("10 - OS por Técnico (Responsável)");
            System.out.println("0  - Voltar");
            System.out.print("Opção: ");

            try {
                int op = Integer.parseInt(scanner.nextLine().trim());
                switch (op) {
                    case 1  -> criarCorretiva(scanner);
                    case 2  -> criarPreventiva(scanner);
                    case 3  -> listarTodas();
                    case 4  -> buscarPorId(scanner);
                    case 5  -> listarAbertas();
                    case 6  -> atualizarStatus(scanner);
                    case 7  -> historico(scanner);
                    case 8  -> cancelar(scanner);
                    case 9  -> osPorEquipamento(scanner);
                    case 10 -> osPorTecnico(scanner);
                    case 0  -> continuar = false;
                    default -> System.out.println("Opção inválida!");
                }
            } catch (NumberFormatException e) {
                System.out.println("Digite um número válido.");
            } catch (Exception e) {
                System.out.println("Erro: " + e.getMessage());
            }
        }
    }

    private static void criarCorretiva(Scanner s) throws Exception {
        System.out.print("ID do Equipamento: ");      Long equipId    = Long.parseLong(s.nextLine().trim());
        System.out.print("ID do Técnico: ");           Long tecId      = Long.parseLong(s.nextLine().trim());
        System.out.print("Descrição: ");               String desc     = s.nextLine();
        System.out.print("Setor: ");                   String setor    = s.nextLine();
        System.out.print("Descrição da falha: ");      String falhaDesc= s.nextLine();
        System.out.print("Falha total? (s/n): ");      boolean falhaTotal = s.nextLine().trim().equalsIgnoreCase("s");
        System.out.print("Nível de criticidade (1-4): "); int nivel    = Integer.parseInt(s.nextLine().trim());

        var os = osService.criarCorretiva(equipId, tecId, desc, setor, falhaDesc, falhaTotal, nivel);
        System.out.printf("OS Corretiva criada! ID=%d | Prioridade calculada=%d%n",
                os.getId(), os.calcularPrioridade());
    }

    private static void criarPreventiva(Scanner s) throws Exception {
        System.out.print("ID do Equipamento: ");          Long equipId = Long.parseLong(s.nextLine().trim());
        System.out.print("ID do Técnico: ");               Long tecId  = Long.parseLong(s.nextLine().trim());
        System.out.print("Descrição: ");                   String desc = s.nextLine();
        System.out.print("Setor: ");                       String setor= s.nextLine();
        System.out.print("Data prevista (AAAA-MM-DD): ");  LocalDate dataPrevista = LocalDate.parse(s.nextLine().trim());
        System.out.print("Periodicidade (dias): ");         int periodo = Integer.parseInt(s.nextLine().trim());
        System.out.print("Última manutenção (AAAA-MM-DD, Enter=nenhuma): ");
        String ultimaStr = s.nextLine().trim();
        LocalDate ultima = ultimaStr.isEmpty() ? null : LocalDate.parse(ultimaStr);

        var os = osService.criarPreventiva(equipId, tecId, desc, setor, dataPrevista, periodo, ultima);
        System.out.printf("OS Preventiva criada! ID=%d | Prioridade calculada=%d%n",
                os.getId(), os.calcularPrioridade());
    }

    private static void listarTodas() throws Exception {
        List<OrdemServico> lista = osService.listarTodas();
        if (lista.isEmpty()) { System.out.println("Nenhuma OS encontrada."); return; }
        imprimirCabecalho();
        lista.forEach(OrdemServicoMenu::imprimirOS);
    }

    private static void listarAbertas() throws Exception {
        List<OrdemServico> lista = osService.listarAbertas();
        if (lista.isEmpty()) { System.out.println("Nenhuma OS aberta."); return; }
        System.out.println("\n--- OS Abertas (ordenadas por prioridade decrescente) ---");
        imprimirCabecalho();
        lista.forEach(OrdemServicoMenu::imprimirOS);
    }

    private static void buscarPorId(Scanner s) throws Exception {
        System.out.print("ID: ");
        Long id = Long.parseLong(s.nextLine().trim());
        osService.buscarPorId(id).ifPresentOrElse(
                os -> System.out.println(os),
                () -> System.out.println("OS não encontrada.")
        );
    }

    private static void atualizarStatus(Scanner s) throws Exception {
        System.out.print("ID da OS: ");
        Long id = Long.parseLong(s.nextLine().trim());
        System.out.print("Novo status (ABERTA/EM_ANDAMENTO/PAUSADA/CONCLUIDA/CANCELADA): ");
        String status = s.nextLine().trim();
        System.out.print("Observações: ");
        String obs = s.nextLine();
        osService.atualizarStatus(id, status, obs);
        System.out.println("Status atualizado!");
    }

    private static void historico(Scanner s) throws Exception {
        System.out.print("ID da OS: ");
        Long id = Long.parseLong(s.nextLine().trim());
        List<HistoricoStatus> hist = osService.historicoDaOS(id);
        if (hist.isEmpty()) { System.out.println("Sem histórico para esta OS."); return; }
        System.out.println("\n--- Histórico da OS #" + id + " ---");
        for (HistoricoStatus h : hist) System.out.println(h);
    }

    private static void cancelar(Scanner s) throws Exception {
        System.out.print("ID da OS a cancelar: ");
        Long id = Long.parseLong(s.nextLine().trim());
        osService.cancelar(id);
        System.out.println("OS cancelada.");
    }

    private static void osPorEquipamento(Scanner s) throws Exception {
        System.out.print("ID do Equipamento: ");
        Long id = Long.parseLong(s.nextLine().trim());
        List<OrdemServico> lista = osService.listarPorEquipamento(id);
        if (lista.isEmpty()) { System.out.println("Nenhuma OS para este equipamento."); return; }
        imprimirCabecalho();
        lista.forEach(OrdemServicoMenu::imprimirOS);
    }

    private static void osPorTecnico(Scanner s) throws Exception {
        System.out.print("ID do Técnico: ");
        Long id = Long.parseLong(s.nextLine().trim());
        List<OrdemServico> lista = osService.listarPorTecnico(id);
        if (lista.isEmpty()) { System.out.println("Nenhuma OS para este técnico."); return; }
        imprimirCabecalho();
        lista.forEach(OrdemServicoMenu::imprimirOS);
    }

    private static void imprimirCabecalho() {
        System.out.printf("%n%-5s %-12s %-10s %-15s %-10s%n", "ID", "Tipo", "Status", "Setor", "Prioridade");
        System.out.println("-".repeat(55));
    }

    private static void imprimirOS(OrdemServico os) {
        System.out.printf("%-5d %-12s %-10s %-15s %-10d%n",
                os.getId(), os.getTipo(), os.getStatus(), os.getSetor(), os.calcularPrioridade());
    }
}
