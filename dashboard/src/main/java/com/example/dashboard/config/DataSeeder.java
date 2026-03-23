package com.example.dashboard.config;

import com.example.dashboard.model.*;
import com.example.dashboard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final TravelPackageRepository packageRepository;
        private final MessageRepository messageRepository;
        private final DealRepository dealRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                if (userRepository.count() > 0)
                        return;

                System.out.println(">>> Starting Data Seeding...");

                // === SEED USERS ===
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin3@travelie.com");
                admin.setPassword(passwordEncoder.encode("password"));
                admin.setRole(Role.ADMIN);
                admin = userRepository.save(admin);

                User guide1 = new User();
                guide1.setName("Priya Sharma");
                guide1.setEmail("priya.guide@travelie.com");
                guide1.setPassword(passwordEncoder.encode("password"));
                guide1.setRole(Role.GUIDE);
                userRepository.save(guide1);

                User guide2 = new User();
                guide2.setName("Marco Rossi");
                guide2.setEmail("marco.guide@travelie.com");
                guide2.setPassword(passwordEncoder.encode("password"));
                guide2.setRole(Role.GUIDE);
                userRepository.save(guide2);

                User traveler1 = new User();
                traveler1.setName("John Doe");
                traveler1.setEmail("john@example.com");
                traveler1.setPassword(passwordEncoder.encode("password"));
                traveler1.setRole(Role.TRAVELER);
                traveler1 = userRepository.save(traveler1);

                User traveler2 = new User();
                traveler2.setName("Alice Kim");
                traveler2.setEmail("alice@example.com");
                traveler2.setPassword(passwordEncoder.encode("password"));
                traveler2.setRole(Role.TRAVELER);
                userRepository.save(traveler2);

                // === SEED TRAVEL PACKAGES ===
                TravelPackage pkg1 = new TravelPackage();
                pkg1.setTitle("Maldives Luxury Escape");
                pkg1.setDescription(
                                "Experience the ultimate tropical paradise with overwater villas, crystal clear lagoons, and world-class snorkeling. All-inclusive resort experience.");
                pkg1.setLocation("Maldives");
                pkg1.setPrice(new BigDecimal("1299.00"));
                pkg1.setDurationDays(7);
                pkg1.setDurationNights(6);
                pkg1.setAvailableSlots(10);
                pkg1.setRating(4.9);
                pkg1.setAvailable(true);
                pkg1 = packageRepository.save(pkg1);

                TravelPackage pkg2 = new TravelPackage();
                pkg2.setTitle("Swiss Alps Ski Adventure");
                pkg2.setDescription(
                                "Breathtaking views and world-class ski slopes in the heart of the Alps. Includes ski pass, equipment rental, and cozy chalet accommodation.");
                pkg2.setLocation("Switzerland");
                pkg2.setPrice(new BigDecimal("850.00"));
                pkg2.setDurationDays(5);
                pkg2.setDurationNights(4);
                pkg2.setAvailableSlots(8);
                pkg2.setRating(4.7);
                pkg2.setAvailable(true);
                packageRepository.save(pkg2);

                TravelPackage pkg3 = new TravelPackage();
                pkg3.setTitle("Bali Cultural Odyssey");
                pkg3.setDescription(
                                "Immerse yourself in Balinese culture with temple visits, traditional cooking classes, rice terrace treks, and healing spa rituals.");
                pkg3.setLocation("Bali, Indonesia");
                pkg3.setPrice(new BigDecimal("599.00"));
                pkg3.setDurationDays(8);
                pkg3.setDurationNights(7);
                pkg3.setAvailableSlots(15);
                pkg3.setRating(4.8);
                pkg3.setAvailable(true);
                TravelPackage savedPkg3 = packageRepository.save(pkg3);

                TravelPackage pkg4 = new TravelPackage();
                pkg4.setTitle("Santorini Sunset Retreat");
                pkg4.setDescription(
                                "Iconic white-washed villages, volcanic beaches, and the world-famous Santorini sunset. Wine tasting tours, yacht cruise, and luxury cave hotel.");
                pkg4.setLocation("Santorini, Greece");
                pkg4.setPrice(new BigDecimal("980.00"));
                pkg4.setDurationDays(6);
                pkg4.setDurationNights(5);
                pkg4.setAvailableSlots(12);
                pkg4.setRating(4.9);
                pkg4.setAvailable(true);
                packageRepository.save(pkg4);

                TravelPackage pkg5 = new TravelPackage();
                pkg5.setTitle("Patagonia Wilderness Trek");
                pkg5.setDescription(
                                "Epic trekking through Torres del Paine National Park. Glaciers, condors, guanacos, and jaw-dropping mountain peaks. Full camping and lodge options.");
                pkg5.setLocation("Patagonia, Argentina");
                pkg5.setPrice(new BigDecimal("1100.00"));
                pkg5.setDurationDays(10);
                pkg5.setDurationNights(9);
                pkg5.setAvailableSlots(6);
                pkg5.setRating(4.8);
                pkg5.setAvailable(true);
                packageRepository.save(pkg5);

                TravelPackage pkg6 = new TravelPackage();
                pkg6.setTitle("Japan Cherry Blossom Tour");
                pkg6.setDescription(
                                "Witness Japan's breathtaking sakura season across Tokyo, Kyoto, and Osaka. Includes bullet train pass, ryokan stay, and tea ceremony experience.");
                pkg6.setLocation("Japan");
                pkg6.setPrice(new BigDecimal("1450.00"));
                pkg6.setDurationDays(12);
                pkg6.setDurationNights(11);
                pkg6.setAvailableSlots(10);
                pkg6.setRating(5.0);
                pkg6.setAvailable(true);
                TravelPackage savedPkg6 = packageRepository.save(pkg6);

                TravelPackage pkg7 = new TravelPackage();
                pkg7.setTitle("Morocco Desert Adventure");
                pkg7.setDescription(
                                "Journey through Marrakech's medina, ride camels in the Sahara Desert, stay in a luxury desert camp, and explore ancient kasbahs.");
                pkg7.setLocation("Morocco");
                pkg7.setPrice(new BigDecimal("720.00"));
                pkg7.setDurationDays(7);
                pkg7.setDurationNights(6);
                pkg7.setAvailableSlots(12);
                pkg7.setRating(4.6);
                pkg7.setAvailable(true);
                packageRepository.save(pkg7);

                TravelPackage pkg8 = new TravelPackage();
                pkg8.setTitle("Iceland Northern Lights Hunt");
                pkg8.setDescription(
                                "Chase the Aurora Borealis across Iceland's volcanic landscape. Geothermal spas, whale watching, glacier hikes, and the midnight sun.");
                pkg8.setLocation("Iceland");
                pkg8.setPrice(new BigDecimal("1350.00"));
                pkg8.setDurationDays(7);
                pkg8.setDurationNights(6);
                pkg8.setAvailableSlots(8);
                pkg8.setRating(4.9);
                pkg8.setAvailable(true);
                packageRepository.save(pkg8);

                // === SEED DEALS ===
                Deal deal1 = new Deal();
                deal1.setTitle("Early Bird Bali Discount");
                deal1.setDiscountPercentage(20.0);
                deal1.setTravelPackage(savedPkg3);
                deal1.setValidUntil(LocalDateTime.now().plusDays(30));
                dealRepository.save(deal1);

                Deal deal2 = new Deal();
                deal2.setTitle("Golden Week Japan Special");
                deal2.setDiscountPercentage(15.0);
                deal2.setTravelPackage(savedPkg6);
                deal2.setValidUntil(LocalDateTime.now().plusDays(14));
                dealRepository.save(deal2);

                Deal deal3 = new Deal();
                deal3.setTitle("Peak Season Maldives Offer");
                deal3.setDiscountPercentage(10.0);
                deal3.setTravelPackage(pkg1);
                deal3.setValidUntil(LocalDateTime.now().plusDays(7));
                dealRepository.save(deal3);

                // === SEED MESSAGES ===
                Message msg1 = new Message();
                msg1.setSender(traveler1);
                msg1.setReceiver(admin);
                msg1.setContent("Hello! I am interested in the Maldives package. Is it still available for June?");
                msg1.setRead(false);
                messageRepository.save(msg1);

                Message msg2 = new Message();
                msg2.setSender(admin);
                msg2.setReceiver(traveler1);
                msg2.setContent(
                                "Yes, the Maldives package is available for June! We have 10 slots remaining. Would you like me to hold a spot for you?");
                msg2.setRead(false);
                messageRepository.save(msg2);

                System.out.println(">>> Data Seeding Complete! Seeded: 5 users, 8 packages, 3 deals, 2 messages.");
        }
}
