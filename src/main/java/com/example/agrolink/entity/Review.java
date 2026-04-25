package com.example.agrolink.entity;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;
    private String comment;

    @ManyToOne
    private User buyer;

    @ManyToOne
    private Crop crop;
}