using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        if (await dbContext.Categories.AnyAsync())
        {
            return;
        }

        var categories = new List<Category>
        {
            new()
            {
                Name = "Ηλεκτρικά Πατίνια",
                Slug = "electric-scooters",
                Description = "Νέα μοντέλα με υψηλή αυτονομία και premium ασφάλεια.",
                ImageUrl = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
                DisplayOrder = 1
            },
            new()
            {
                Name = "Ηλεκτρικά Ποδήλατα",
                Slug = "electric-bikes",
                Description = "Urban και trekking e-bikes για μετακίνηση και ελεύθερο χρόνο.",
                ImageUrl = "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=1200&q=80",
                DisplayOrder = 2
            },
            new()
            {
                Name = "Ανταλλακτικά",
                Slug = "spare-parts",
                Description = "Λάστιχα, μπαταρίες, controllers και αυθεντικά αξεσουάρ.",
                ImageUrl = "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=80",
                DisplayOrder = 3
            },
            new()
            {
                Name = "Tech & Lifestyle",
                Slug = "tech-lifestyle",
                Description = "Αξεσουάρ, κλειδαριές και smart gadgets για καθημερινή χρήση.",
                ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
                DisplayOrder = 4
            }
        };

        dbContext.Categories.AddRange(categories);
        await dbContext.SaveChangesAsync();

        var scootersCategoryId = categories.First(c => c.Slug == "electric-scooters").Id;
        var bikesCategoryId = categories.First(c => c.Slug == "electric-bikes").Id;
        var sparePartsCategoryId = categories.First(c => c.Slug == "spare-parts").Id;

        var products = new List<Product>
        {
            new()
            {
                Name = "MADS Urban X10",
                Slug = "mads-urban-x10",
                ShortDescription = "Ισχυρό e-scooter 800W με διπλή ανάρτηση και 60km αυτονομία.",
                Description = "Ισχυρό e-scooter 800W με διπλή ανάρτηση, premium φρένα, smart οθόνη και υψηλή αυτονομία για καθημερινή μετακίνηση.",
                Price = 1190m,
                IsFeatured = true,
                Status = ProductStatus.Active,
                StockQuantity = 12,
                Sku = "MADS-X10-001",
                ImageUrl = "https://images.unsplash.com/photo-1612629618144-8ca28f45fdd5?auto=format&fit=crop&w=1200&q=80",
                CategoryId = scootersCategoryId
            },
            new()
            {
                Name = "MADS City Air 9",
                Slug = "mads-city-air-9",
                ShortDescription = "Ελαφρύ πατίνι πόλης με tubeless ελαστικά και smart display.",
                Description = "Ελαφρύ πατίνι πόλης με tubeless ελαστικά, led φώτα και ψηφιακή ένδειξη μπαταρίας. Ιδανικό για αστικές διαδρομές.",
                Price = 820m,
                IsFeatured = true,
                Status = ProductStatus.Active,
                StockQuantity = 20,
                Sku = "MADS-CA9-001",
                ImageUrl = "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&w=1200&q=80",
                CategoryId = scootersCategoryId
            },
            new()
            {
                Name = "MADS Explorer E-Bike",
                Slug = "mads-explorer-ebike",
                ShortDescription = "Fat-tire ηλεκτρικό ποδήλατο με μπαταρία 48V 14Ah.",
                Description = "Fat-tire ηλεκτρικό ποδήλατο με μπαταρία 48V 14Ah, πολλαπλές ταχύτητες υποβοήθησης και ενισχυμένο πλαίσιο.",
                Price = 1690m,
                IsFeatured = true,
                Status = ProductStatus.Active,
                StockQuantity = 8,
                Sku = "MADS-EXP-001",
                ImageUrl = "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80",
                CategoryId = bikesCategoryId
            },
            new()
            {
                Name = "Controller Xiaomi Compatible",
                Slug = "controller-xiaomi-compatible",
                ShortDescription = "Ανταλλακτικός εγκέφαλος συμβατός με δημοφιλή μοντέλα Xiaomi.",
                Description = "Ανταλλακτικός εγκέφαλος συμβατός με δημοφιλή μοντέλα Xiaomi για άμεση αποκατάσταση ή αναβάθμιση λειτουργίας.",
                Price = 79m,
                IsFeatured = false,
                Status = ProductStatus.Active,
                StockQuantity = 30,
                Sku = "CTRL-XIA-001",
                ImageUrl = "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=1200&q=80",
                CategoryId = sparePartsCategoryId
            },
            new()
            {
                Name = "Tubeless Tire 10x2.5",
                Slug = "tubeless-tire-10x2-5",
                ShortDescription = "Ελαστικό tubeless μεγάλης αντοχής για καθημερινή χρήση.",
                Description = "Ελαστικό tubeless 10x2.5 με ενισχυμένη αντοχή σε φθορά και σταθερή πρόσφυση σε αστικές συνθήκες.",
                Price = 45m,
                IsFeatured = false,
                Status = ProductStatus.OutOfStock,
                StockQuantity = 0,
                Sku = "TIRE-TBL-001",
                ImageUrl = "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80",
                CategoryId = sparePartsCategoryId
            }
        };

        var services = new List<ServiceOffering>
        {
            new()
            {
                Name = "Γενικό Service Πατινιών",
                Description = "Διάγνωση, έλεγχος φρένων, ανάρτησης και ηλεκτρονικών συστημάτων.",
                PriceFrom = 35m,
                Duration = "90 λεπτά",
                DisplayOrder = 1,
                Status = ServiceStatus.Published
            },
            new()
            {
                Name = "Αλλαγή Μπαταρίας & Αναβάθμιση",
                Description = "Αντικατάσταση ή προσθήκη μπαταρίας με πλήρη έλεγχο φόρτισης.",
                PriceFrom = 120m,
                Duration = "2-3 ώρες",
                DisplayOrder = 2,
                Status = ServiceStatus.Published
            },
            new()
            {
                Name = "Εγκατάσταση Ελαστικών & Ανάρτησης",
                Description = "Solid/tubeless λύσεις και βελτιώσεις για μεγαλύτερη άνεση.",
                PriceFrom = 50m,
                Duration = "60 λεπτά",
                DisplayOrder = 3,
                Status = ServiceStatus.Published
            },
            new()
            {
                Name = "Έλεγχος Ασφαλείας Πριν την Πώληση",
                Description = "Πλήρης τεχνικός έλεγχος για συσκευές που θα μεταπωληθούν.",
                PriceFrom = 30m,
                Duration = "45 λεπτά",
                DisplayOrder = 4,
                Status = ServiceStatus.Published
            }
        };

        products[0].Characteristics.AddRange(
        [
            new ProductCharacteristic { Label = "Ισχύς", Value = "800W", GroupName = "Τεχνικά", SortOrder = 1 },
            new ProductCharacteristic { Label = "Αυτονομία", Value = "Έως 60km", GroupName = "Τεχνικά", SortOrder = 2 },
            new ProductCharacteristic { Label = "Μέγιστη Ταχύτητα", Value = "45 km/h", GroupName = "Τεχνικά", SortOrder = 3 },
            new ProductCharacteristic { Label = "Μπαταρία", Value = "48V 15Ah", GroupName = "Τεχνικά", SortOrder = 4 }
        ]);

        products[1].Characteristics.AddRange(
        [
            new ProductCharacteristic { Label = "Ισχύς", Value = "600W", GroupName = "Τεχνικά", SortOrder = 1 },
            new ProductCharacteristic { Label = "Αυτονομία", Value = "Έως 40km", GroupName = "Τεχνικά", SortOrder = 2 },
            new ProductCharacteristic { Label = "Ελαστικά", Value = "Tubeless 10\"", GroupName = "Κατασκευή", SortOrder = 3 },
            new ProductCharacteristic { Label = "Βάρος", Value = "18kg", GroupName = "Κατασκευή", SortOrder = 4 }
        ]);

        products[2].Characteristics.AddRange(
        [
            new ProductCharacteristic { Label = "Μπαταρία", Value = "48V 14Ah", GroupName = "Τεχνικά", SortOrder = 1 },
            new ProductCharacteristic { Label = "Ελαστικά", Value = "Fat Tire 20x4", GroupName = "Κατασκευή", SortOrder = 2 },
            new ProductCharacteristic { Label = "Αυτονομία", Value = "Έως 85km", GroupName = "Τεχνικά", SortOrder = 3 },
            new ProductCharacteristic { Label = "Τύπος", Value = "Ηλεκτρικό Ποδήλατο", GroupName = "Γενικά", SortOrder = 4 }
        ]);

        dbContext.Products.AddRange(products);
        dbContext.ServiceOfferings.AddRange(services);
        await dbContext.SaveChangesAsync();
    }
}
