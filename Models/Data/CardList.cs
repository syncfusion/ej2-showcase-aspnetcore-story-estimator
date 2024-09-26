namespace StoryEstimator.Showcase.Models.Data
{
    using System.Collections.Generic;

    public class CardList
    {
        public int CardValueId { get; set; }
        public decimal CardValue { get; set; }
        public int CardTypeId { get; set; }

        public List<CardList> GetCardList()
        {
            List<CardList> cards = new List<CardList>
            {
                new CardList
                {
                    CardValueId = 1,
                    CardValue = 0.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                    CardValueId = 2,
                    CardValue = 1.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                   CardValueId = 3,
                    CardValue = 2.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                    CardValueId = 4,
                    CardValue = 3.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                    CardValueId = 5,
                    CardValue = 4.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                    CardValueId = 6,
                    CardValue = 5.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                   CardValueId = 7,
                    CardValue = 6.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                    CardValueId = 8,
                    CardValue = 7.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                    CardValueId = 9,
                    CardValue = 8.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                   CardValueId = 10,
                    CardValue = 9.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                    CardValueId = 11,
                    CardValue = 10.00m,
                    CardTypeId = 1
                },
                new CardList
                {
                    CardValueId = 12,
                    CardValue = 0.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                    CardValueId = 13,
                    CardValue = 1.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                   CardValueId = 14,
                    CardValue = 2.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                    CardValueId = 15,
                    CardValue = 3.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                    CardValueId = 16,
                    CardValue = 5.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                    CardValueId = 17,
                    CardValue = 8.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                   CardValueId = 18,
                    CardValue = 13.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                    CardValueId = 19,
                    CardValue = 21.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                    CardValueId = 20,
                    CardValue = 34.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                   CardValueId = 21,
                    CardValue = 55.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                    CardValueId = 22,
                    CardValue = 89.00m,
                    CardTypeId = 2
                },
                new CardList
                {
                    CardValueId = 23,
                    CardValue = 0.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                    CardValueId = 24,
                    CardValue = 1.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                   CardValueId = 25,
                    CardValue = 2.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                    CardValueId = 26,
                    CardValue = 3.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                    CardValueId = 27,
                    CardValue = 5.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                    CardValueId = 28,
                    CardValue = 8.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                   CardValueId = 29,
                    CardValue = 13.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                    CardValueId = 30,
                    CardValue = 21.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                    CardValueId = 31,
                    CardValue = 34.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                   CardValueId = 32,
                    CardValue = 55.00m,
                    CardTypeId = 3
                },
                new CardList
                {
                    CardValueId = 33,
                    CardValue = 89.00m,
                    CardTypeId = 3
                }
            };

            return cards;
        }
    }

    public class CardValues
    {
        private readonly List<decimal> sequentialValues = new List<decimal>() { 0.00m, 1.00m, 2.00m, 3.00m, 4.00m, 5.00m, 6.00m, 7.00m, 8.00m, 9.00m, 10.00m };

        private readonly List<decimal> fibonacciValues = new List<decimal>() { 0.00m, 1.00m, 2.00m, 3.00m, 5.00m, 8.00m, 13.00m, 21.00m, 34.00m, 55.00m, 89.00m };

        private readonly List<decimal> scrumValues = new List<decimal>() { 0.00m, 0.50m, 1.00m, 2.00m, 3.00m, 5.00m, 8.00m, 13.00m, 20.00m, 40.00m, 100.00m };

        public List<decimal> GetSequentialValues()
        {
            return this.sequentialValues;
        }

        public List<decimal> GetFibonacciValues()
        {
            return this.fibonacciValues;
        }

        public List<decimal> GetScrumValues()
        {
            return this.scrumValues;
        }
    }
}
