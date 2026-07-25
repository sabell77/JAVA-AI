package com.example.supportdesk.service;

import com.example.supportdesk.dto.ReportCountResponse;
import com.example.supportdesk.model.Ticket;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketReportService {

    private final MongoTemplate mongoTemplate;

    public TicketReportService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<ReportCountResponse> getTicketsByStatus() {
        Aggregation aggregation = Aggregation.newAggregation(
            // 1. Convert status field to UPPERCASE before grouping
            Aggregation.project("count")
                    .andExpression("toUpper(status)").as("statusUpper"),

            // 2. Group by the normalized upper case status
            Aggregation.group("statusUpper").count().as("count"),

            // 3. Project _id back to 'label'
            Aggregation.project("count")
                    .and("_id").as("label")
        );

        AggregationResults<ReportCountResponse> results = mongoTemplate.aggregate(
            aggregation,
            Ticket.class,
            ReportCountResponse.class
        );

        return results.getMappedResults();
    }
}