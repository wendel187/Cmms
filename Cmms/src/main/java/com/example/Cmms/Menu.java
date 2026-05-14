package com.example.Cmms;

import com.example.Cmms.menu.EquipamentoMenu;
import com.example.Cmms.menu.OrdemServicoMenu;
import com.example.Cmms.menu.RelatoriosMenu;
import com.example.Cmms.menu.TecnicoMenu;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
public class Menu {

    public static void start() {
        Scanner scanner = new Scanner(System.in);
        boolean continuar = true;

        while (continuar) {
            System.out.println("\n╔══════════════════════════════════════╗");
            System.out.println("║   CMMS - Gestão de Manutenção        ║");
            System.out.println("╠══════════════════════════════════════╣");
            System.out.println("║  1 - Equipamentos (Ativos)           ║");
            System.out.println("║  2 - Técnicos                        ║");
            System.out.println("║  3 - Ordens de Serviço               ║");
            System.out.println("║  4 - Relatórios                      ║");
            System.out.println("║  0 - Sair                            ║");
            System.out.println("╚══════════════════════════════════════╝");
            System.out.print("Opção: ");

            try {
                int opcao = Integer.parseInt(scanner.nextLine().trim());
                switch (opcao) {
                    case 1 -> EquipamentoMenu.menu(scanner);
                    case 2 -> TecnicoMenu.menu(scanner);
                    case 3 -> OrdemServicoMenu.menu(scanner);
                    case 4 -> RelatoriosMenu.menu(scanner);
                    case 0 -> {
                        System.out.println("Encerrando sistema. Até logo!");
                        continuar = false;
                    }
                    default -> System.out.println("Opção inválida!");
                }
            } catch (NumberFormatException e) {
                System.out.println("Digite um número válido.");
            }
        }
    }
}
